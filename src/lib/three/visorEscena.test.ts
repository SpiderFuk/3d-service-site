import { describe, expect, it } from 'vitest';
import { BoxGeometry, CylinderGeometry, Mesh, PerspectiveCamera, Vector3 } from 'three';
import { DIRECCION_CAMARA, FOCO, distanciaEncuadre, medirCilindro, type Cilindro } from './visorEscena';

/** Mayor |x| o |y| en coordenadas de pantalla (-1 a 1) de los bordes del cilindro */
function ocupacion(cilindro: Cilindro, aspecto: number): number {
	const camara = new PerspectiveCamera(50, aspecto, 0.1, 1e6);
	camara.position.copy(DIRECCION_CAMARA).multiplyScalar(distanciaEncuadre(cilindro, 50, aspecto));
	camara.lookAt(0, 0, 0);
	camara.updateMatrixWorld(true);

	let maximo = 0;
	for (let i = 0; i < 360; i++) {
		const a = (i / 360) * Math.PI * 2;
		for (const y of [cilindro.yMin, cilindro.yMax]) {
			const p = new Vector3(Math.cos(a) * cilindro.radio, y, Math.sin(a) * cilindro.radio);
			p.project(camara);
			maximo = Math.max(maximo, Math.abs(p.x), Math.abs(p.y));
		}
	}
	return maximo;
}

describe('encuadre del visor', () => {
	const modelos: Record<string, Cilindro> = {
		'alto y fino (jarrón)': { radio: 30, yMin: -110, yMax: 110 },
		'chato y ancho (cuadro acostado)': { radio: 90, yMin: -3, yMax: 3 },
		'compacto (miniatura)': { radio: 12, yMin: -15, yMax: 15 },
		'grande (santa)': { radio: 70, yMin: -90, yMax: 90 }
	};

	for (const aspecto of [4 / 3.3, 16 / 9, 1]) {
		for (const [nombre, cilindro] of Object.entries(modelos)) {
			it(`${nombre} llena el FOCO del marco con aspecto ${aspecto.toFixed(2)}`, () => {
				expect(ocupacion(cilindro, aspecto)).toBeCloseTo(FOCO, 2);
			});
		}
	}

	it('mide el radio sobre los vértices: un cilindro redondo no se agranda como su caja', () => {
		const redondo = medirCilindro(new Mesh(new CylinderGeometry(10, 10, 40, 64)));
		const cuadrado = medirCilindro(new Mesh(new BoxGeometry(20, 40, 20)));
		expect(redondo.radio).toBeCloseTo(10, 5);
		expect(cuadrado.radio).toBeCloseTo(Math.hypot(10, 10), 5);
		expect(redondo.yMax - redondo.yMin).toBeCloseTo(40, 5);
	});
});
