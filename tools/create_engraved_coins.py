import math
from pathlib import Path

import bpy
from mathutils import Vector


ROOT = Path(r"C:\Users\Maestro\Desktop\ali website vs")
SOURCE = ROOT / "website" / "public" / "silver_coin.glb"
OUT_DIR = ROOT / "website" / "public" / "engraved-coins"
WORDS = ("Governance", "Execution", "Strategy")

TEXT_WIDTH_RATIO = 0.72


def clear_scene():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete()


def import_coin():
    bpy.ops.import_scene.gltf(filepath=str(SOURCE))
    mesh_objects = [obj for obj in bpy.context.scene.objects if obj.type == "MESH"]
    if not mesh_objects:
        raise RuntimeError("No mesh objects found after importing coin")
    return max(mesh_objects, key=lambda obj: max(obj.dimensions))


def scene_bounds(objects):
    corners = []
    for obj in objects:
        for corner in obj.bound_box:
            corners.append(obj.matrix_world @ Vector(corner))
    min_v = Vector((min(v.x for v in corners), min(v.y for v in corners), min(v.z for v in corners)))
    max_v = Vector((max(v.x for v in corners), max(v.y for v in corners), max(v.z for v in corners)))
    return min_v, max_v


def center_scene():
    objects = [obj for obj in bpy.context.scene.objects if obj.type in {"MESH", "EMPTY"}]
    min_v, max_v = scene_bounds([obj for obj in bpy.context.scene.objects if obj.type == "MESH"])
    center = (min_v + max_v) * 0.5
    for obj in objects:
        obj.location -= center


def make_dark_metal_material():
    material = bpy.data.materials.new("engraved_dark_metal")
    material.use_nodes = True
    bsdf = material.node_tree.nodes.get("Principled BSDF")
    if bsdf:
        bsdf.inputs["Base Color"].default_value = (0.035, 0.035, 0.033, 1.0)
        bsdf.inputs["Metallic"].default_value = 1.0
        bsdf.inputs["Roughness"].default_value = 0.38
    return material


def text_dimensions(obj):
    bpy.context.view_layer.update()
    corners = [obj.matrix_world @ Vector(corner) for corner in obj.bound_box]
    min_v = Vector((min(v.x for v in corners), min(v.y for v in corners), min(v.z for v in corners)))
    max_v = Vector((max(v.x for v in corners), max(v.y for v in corners), max(v.z for v in corners)))
    return max_v - min_v


def add_word(word, coin_width):
    text_curve = bpy.data.curves.new(f"{word}_engraved_label", "FONT")
    text_curve.body = word.upper()
    text_curve.align_x = "CENTER"
    text_curve.align_y = "CENTER"
    text_curve.size = 1.0
    text_curve.extrude = 0.012
    text_curve.resolution_u = 12

    text_obj = bpy.data.objects.new(f"{word}_label", text_curve)
    bpy.context.collection.objects.link(text_obj)

    # The source GLB has nested transforms. In exported world space, the readable
    # coin face is the XZ plane, with depth on Y. Place the word centered on that
    # face and keep it just proud of the surface for an inset/engraved read.
    text_obj.location = (0.0, -0.166, 0.08)
    text_obj.rotation_euler = (math.radians(90), 0, 0)
    text_obj.scale = (1.0, 1.0, 1.0)
    width = text_dimensions(text_obj).x or 1
    text_obj.scale = (coin_width * TEXT_WIDTH_RATIO / width, coin_width * TEXT_WIDTH_RATIO / width, 1.0)
    text_obj.data.materials.append(make_dark_metal_material())
    return text_obj


def add_lighting_and_camera():
    bpy.ops.object.light_add(type="AREA", location=(0, -4, 4))
    key = bpy.context.object
    key.name = "Preview_Key_Light"
    key.data.energy = 450
    key.data.size = 4

    bpy.ops.object.camera_add(location=(0, -5.3, 0.25), rotation=(math.radians(87), 0, 0))
    bpy.context.scene.camera = bpy.context.object


def export_word(word):
    clear_scene()
    coin = import_coin()
    center_scene()
    min_v, max_v = scene_bounds([obj for obj in bpy.context.scene.objects if obj.type == "MESH"])
    coin_width = max(max_v.x - min_v.x, max_v.z - min_v.z)
    add_word(word, coin_width)
    add_lighting_and_camera()

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    output = OUT_DIR / f"coin-{word.lower()}.glb"
    bpy.ops.export_scene.gltf(
        filepath=str(output),
        export_format="GLB",
        use_selection=False,
        export_yup=True,
        export_apply=True,
    )
    print(f"EXPORTED {output}")


def main():
    if not SOURCE.exists():
        raise FileNotFoundError(SOURCE)
    for word in WORDS:
        export_word(word)


if __name__ == "__main__":
    main()
