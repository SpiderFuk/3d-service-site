# Track: Rebrand · Visor 3D

**ID:** rebrand-viewer_20261026
**Status:** Pending

## Documents

- [Specification](./spec.md)
- [Implementation Plan](./plan.md)

## Progress

- Phases: 0/3 complete
- Tasks: 0/14 complete

## Owner TODOs

Placeholders are in place until the owner provides these (BUILD.md, "Still open"):

- [ ] **License check** for the four examples (`DrunkSanta.stl`, `mini.stl`, `FlowerVase.stl` and the future "Cuadro en relieve" file): each license must allow showing the model on a business site.
- [ ] **"Cuadro en relieve" file**: send the STL/3MF and set `archivo` in `src/lib/config/visorEjemplos.ts`. Until then the viewer opens a generated relief placeholder (`crearCuadroProvisorio` in `src/lib/three/modeloVisor.ts`).
- [ ] **Real thumbnails** for the four example cards, including the owner's 3D photo for "Cuadro en relieve". Today they are the SVG drawings from `landing-final.html` (`src/lib/components/landing/visor/MiniaturaEjemplo.svelte`).
- [ ] **Example file size**: the example STLs are 25 to 35 MB each (`DrunkSanta.stl` 32 MB, `mini.stl` 35 MB, `FlowerVase.stl` 25 MB), heavy on mobile data. Consider simplified versions (a few MB) or serving them compressed.
- [ ] `DiceTower.stl` is no longer shown in the viewer (can be removed in the cleanup track).

## Quick Links

- [Back to Tracks](../../tracks.md)
- [Product Context](../../product.md)
- [Design handoff](../../../design/landing-v1/BUILD.md)
