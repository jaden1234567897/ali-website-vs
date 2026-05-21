from pathlib import Path

import bpy
from mathutils import Vector


ROOT = Path(r"C:\Users\Maestro\Desktop\ali website vs")
SOURCE = ROOT / "website" / "public" / "engraved-coins-test" / "coin-execution-test.glb"
OUT = ROOT / "_engraving_preview.png"


def clear_scene():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete()


def world_bounds(obj):
    corners = []
    for child in obj.children_recursive:
        if child.type == "MESH":
            corners.extend(child.matrix_world @ Vector(corner) for corner in child.bound_box)
    if obj.type == "MESH":
        corners.extend(obj.matrix_world @ Vector(corner) for corner in obj.bound_box)
    min_v = Vector((min(v.x for v in corners), min(v.y for v in corners), min(v.z for v in corners)))
    max_v = Vector((max(v.x for v in corners), max(v.y for v in corners), max(v.z for v in corners)))
    return min_v, max_v


clear_scene()
bpy.ops.import_scene.gltf(filepath=str(SOURCE))

root = bpy.data.objects.new("preview_root", None)
bpy.context.collection.objects.link(root)
for obj in [item for item in bpy.context.scene.objects if item != root and item.parent is None]:
    obj.parent = root

min_v, max_v = world_bounds(root)
center = (min_v + max_v) * 0.5
for obj in root.children:
    obj.location -= center

min_v, max_v = world_bounds(root)
size = max(max_v.x - min_v.x, max_v.y - min_v.y, max_v.z - min_v.z)
root.scale = (2.7 / size, 2.7 / size, 2.7 / size)

bpy.ops.object.light_add(type="AREA", location=(0, -4, 4))
key = bpy.context.object
key.data.energy = 450
key.data.size = 5

bpy.ops.object.light_add(type="POINT", location=(-3, 2, 3))
rim = bpy.context.object
rim.data.energy = 260

bpy.ops.object.camera_add(location=(0, -5.8, 0), rotation=(1.5708, 0, 0))
bpy.context.scene.camera = bpy.context.object

bpy.context.scene.render.engine = "BLENDER_EEVEE"
bpy.context.scene.eevee.taa_render_samples = 64
bpy.context.scene.render.resolution_x = 1280
bpy.context.scene.render.resolution_y = 860
bpy.context.scene.view_settings.view_transform = "Filmic"
bpy.context.scene.view_settings.look = "Medium High Contrast"
bpy.context.scene.render.film_transparent = False
bpy.context.scene.world.color = (0.002, 0.004, 0.005)
bpy.context.scene.render.filepath = str(OUT)
bpy.ops.render.render(write_still=True)
print(f"RENDERED {OUT}")
