/**
 * Utilidades para mejorar materiales de modelos 3D
 */

import { Mesh, MeshStandardMaterial, MeshPhongMaterial } from 'three';
import type { Object3D, Material } from 'three';

/**
 * Mejora materiales para mejor visualización
 * Aumenta emisión y ajusta propiedades para colores más vibrantes
 * Soporta MeshStandardMaterial (STL) y MeshPhongMaterial (OBJ/MTL)
 */
export function enhanceMaterials(object: Object3D) {
	object.traverse((child) => {
		if (child instanceof Mesh) {
			const materials = Array.isArray(child.material) ? child.material : [child.material];
			materials.forEach((material: Material) => {
				if (material instanceof MeshStandardMaterial || material instanceof MeshPhongMaterial) {
					const color = material.color.clone();
					const brightness = (color.r + color.g + color.b) / 3;

					// Emisión más fuerte para colores claros (blancos y grises claros)
					material.emissive = color.clone();

					// Aumentar intensidad emisiva especialmente para colores claros
					// Colores con brightness > 0.5 reciben boost adicional
					if (brightness > 0.5) {
						material.emissiveIntensity = 0.6 + (brightness * 0.4); // 0.6-1.0 para claros
					} else {
						material.emissiveIntensity = brightness * 0.5; // 0-0.5 para oscuros
					}

					// metalness/roughness solo existen en MeshStandardMaterial
					if (material instanceof MeshStandardMaterial) {
						material.metalness = 0.1;
						material.roughness = 0.4;
					}
				}
			});
		}
	});
}
