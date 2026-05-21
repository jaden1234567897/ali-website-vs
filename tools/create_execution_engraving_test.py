import math
from pathlib import Path

import bpy
from mathutils import Vector


ROOT = Path(r"C:\Users\Maestro\Desktop\ali website vs")
SOURCE = ROOT / "website" / "public" / "silver_coin.glb"
OUT_DIR = ROOT / "website" / "public" / "engraved-coins-test"
OUT_FILE = OUT_DIR / "coin-execution-test.glb"
FINAL_DIR = ROOT / "website" / "public" / "engraved-coins"
FONT_PATH = Path(r"C:\Windows\Fonts\arialbd.ttf")


def clear_scene():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete()


def object_world_bounds(obj):
    corners = [obj.matrix_world @ Vector(corner) for corner in obj.bound_box]
    min_v = Vector((min(v.x for v in corners), min(v.y for v in corners), min(v.z for v in corners)))
    max_v = Vector((max(v.x for v in corners), max(v.y for v in corners), max(v.z for v in corners)))
    return min_v, max_v


def import_source_coin_material_and_bounds():
    bpy.ops.import_scene.gltf(filepath=str(SOURCE))
    mesh_objects = [obj for obj in bpy.context.scene.objects if obj.type == "MESH"]
    if not mesh_objects:
        raise RuntimeError("No mesh objects found after importing coin")

    coin = max(mesh_objects, key=lambda obj: max(obj.dimensions))

    # Keep the visual transform, remove the Sketchfab parent chain, then bake.
    matrix = coin.matrix_world.copy()
    coin.parent = None
    coin.matrix_world = matrix
    bpy.context.view_layer.objects.active = coin
    coin.select_set(True)
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)

    min_v, max_v = object_world_bounds(coin)
    center = (min_v + max_v) * 0.5
    coin.location -= center
    bpy.ops.object.transform_apply(location=True, rotation=False, scale=False)

    min_v, max_v = object_world_bounds(coin)
    material = coin.data.materials[0] if coin.data.materials else None

    # Remove imported objects. The experiment rebuilds the coin as a smooth,
    # edgeless disc while keeping the same silver material family.
    for obj in list(bpy.context.scene.objects):
        bpy.data.objects.remove(obj, do_unlink=True)

    return material, min_v, max_v


def material_clean_silver():
    mat = bpy.data.materials.new("clean_edgeless_silver")
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    if bsdf:
        bsdf.inputs["Base Color"].default_value = (0.74, 0.74, 0.7, 1.0)
        bsdf.inputs["Metallic"].default_value = 1.0
        bsdf.inputs["Roughness"].default_value = 0.5
    return mat


def create_edgeless_coin(_material, source_min, source_max, word):
    radius = max(source_max.x - source_min.x, source_max.z - source_min.z) * 0.5
    thickness = (source_max.y - source_min.y) * 0.72

    bpy.ops.mesh.primitive_cylinder_add(
        vertices=192,
        radius=radius,
        depth=thickness,
        end_fill_type="NGON",
        location=(0, 0, 0),
        rotation=(math.radians(90), 0, 0),
    )
    coin = bpy.context.object
    coin.name = f"silver_coin_{word.lower()}_edgeless_double_sided"
    coin.data.materials.append(material_clean_silver())

    bevel = coin.modifiers.new("barely_there_edge_softening", "BEVEL")
    bevel.width = radius * 0.006
    bevel.segments = 2
    bevel.affect = "EDGES"

    bpy.context.view_layer.objects.active = coin
    coin.select_set(True)
    bpy.ops.object.modifier_apply(modifier=bevel.name)
    bpy.ops.object.shade_flat()
    return coin


def material_dark_groove():
    mat = bpy.data.materials.new("dark_recessed_groove")
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    if bsdf:
        bsdf.inputs["Base Color"].default_value = (0.0, 0.0, 0.0, 1.0)
        bsdf.inputs["Metallic"].default_value = 0.0
        bsdf.inputs["Roughness"].default_value = 0.96
    return mat


def add_text_mesh(
    name,
    body,
    coin_width,
    y,
    z_offset,
    bevel_depth,
    visible=True,
    *,
    depth=0.0,
    material=None,
    filled=True,
    mirror_x=False,
):
    curve = bpy.data.curves.new(name, "FONT")
    curve.body = body
    if FONT_PATH.exists():
        curve.font = bpy.data.fonts.load(str(FONT_PATH))
    curve.align_x = "CENTER"
    curve.align_y = "CENTER"
    curve.size = 1.0
    curve.fill_mode = "BOTH" if filled else "NONE"
    curve.bevel_depth = bevel_depth
    curve.bevel_resolution = 2
    curve.resolution_u = 16
    curve.extrude = 0

    obj = bpy.data.objects.new(name, curve)
    bpy.context.collection.objects.link(obj)
    obj.location = (0.0, y, z_offset)
    obj.rotation_euler = (math.radians(90), 0, 0)

    bpy.context.view_layer.update()
    min_v, max_v = object_world_bounds(obj)
    width = max_v.x - min_v.x
    scale = (coin_width * 0.7) / max(width, 0.001)
    obj.scale = (-scale if mirror_x else scale, scale, scale)
    if depth:
        curve.extrude = depth / scale
    bpy.context.view_layer.update()
    # Font centering is not perfectly geometric for all glyphs. Correct the
    # actual mesh bounds so the word sits exactly in the coin's face center.
    min_v, max_v = object_world_bounds(obj)
    obj.location.x -= (min_v.x + max_v.x) * 0.5
    obj.location.z += z_offset - ((min_v.z + max_v.z) * 0.5)
    # Do not hide the boolean cutter here. Blender refuses to convert/apply
    # hidden objects in background mode; hide it only after conversion/use.
    obj.hide_render = False
    obj.hide_viewport = False
    obj.data.materials.append(material or material_dark_groove())
    return obj


def convert_to_mesh(obj):
    bpy.ops.object.select_all(action="DESELECT")
    obj.hide_viewport = False
    obj.hide_render = False
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.convert(target="MESH")
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    bpy.context.object.data.validate(clean_customdata=False)
    bpy.context.object.data.update()
    return bpy.context.object


def try_cut_groove(coin, cutter):
    bpy.ops.object.select_all(action="DESELECT")
    bpy.context.view_layer.objects.active = coin
    coin.select_set(True)
    mod = coin.modifiers.new("execution_outline_engrave_cut", "BOOLEAN")
    mod.operation = "DIFFERENCE"
    mod.object = cutter
    mod.solver = "EXACT"
    try:
        bpy.ops.object.modifier_apply(modifier=mod.name)
        return True
    except Exception as exc:
        print(f"BOOLEAN_FAILED: {exc}")
        return False


def add_lighting_and_camera():
    bpy.ops.object.light_add(type="AREA", location=(0, -4, 4))
    key = bpy.context.object
    key.name = "Preview_Key_Light"
    key.data.energy = 450
    key.data.size = 4

    bpy.ops.object.camera_add(location=(0, -5.4, 0.0), rotation=(math.radians(90), 0, 0))
    bpy.context.scene.camera = bpy.context.object


def build_coin(word, out_file):
    clear_scene()
    material, source_min, source_max = import_source_coin_material_and_bounds()
    coin = create_edgeless_coin(material, source_min, source_max, word)
    min_v, max_v = object_world_bounds(coin)
    coin_width = max(max_v.x - min_v.x, max_v.z - min_v.z)
    thickness = max_v.y - min_v.y

    front_y = min_v.y
    back_y = max_v.y
    cut_depth = thickness * 0.18
    vertical_offset = 0.0
    bevel = coin_width * 0.0028

    for side, cutter_y, floor_y, mirror_x in (
        ("front", front_y + cut_depth * 0.5, front_y + cut_depth * 0.78, False),
        ("back", back_y - cut_depth * 0.5, back_y - cut_depth * 0.78, True),
    ):
        cutter = add_text_mesh(
            f"{word}_{side}_filled_cutter",
            word,
            coin_width,
            cutter_y,
            vertical_offset,
            bevel,
            visible=False,
            depth=cut_depth,
            filled=True,
            mirror_x=mirror_x,
        )
        cutter_mesh = convert_to_mesh(cutter)
        try_cut_groove(coin, cutter_mesh)
        bpy.data.objects.remove(cutter_mesh, do_unlink=True)

        # A dark bottom plate sits inside the carved cavity, below each face.
        # It is not a surface decal; it only reads through the cut-out letters.
        bed = add_text_mesh(
            f"{word}_{side}_recess_floor",
            word,
            coin_width,
            floor_y,
            vertical_offset,
            0.0,
            visible=True,
            depth=0,
            material=material_dark_groove(),
            filled=True,
            mirror_x=mirror_x,
        )
        convert_to_mesh(bed)

    bpy.ops.object.select_all(action="DESELECT")
    coin.select_set(True)
    bpy.context.view_layer.objects.active = coin
    bpy.ops.object.shade_flat()

    add_lighting_and_camera()
    out_file.parent.mkdir(parents=True, exist_ok=True)
    bpy.ops.export_scene.gltf(
        filepath=str(out_file),
        export_format="GLB",
        use_selection=False,
        export_yup=True,
        export_apply=True,
    )
    print(f"EXPORTED {out_file}")


def main():
    for word in ("EXECUTION", "GOVERNANCE", "STRATEGY"):
        slug = word.lower()
        build_coin(word, OUT_DIR / f"coin-{slug}-test.glb")
        build_coin(word, FINAL_DIR / f"coin-{slug}.glb")


if __name__ == "__main__":
    main()
