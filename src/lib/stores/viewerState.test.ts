import { beforeEach, describe, expect, it } from 'vitest';
import { get } from 'svelte/store';
import { validarArchivoVisor, viewerState } from './viewerState';

const MB = 1024 * 1024;

describe('validarArchivoVisor', () => {
	it('acepta STL y 3MF de hasta 50 MB, sin importar mayúsculas', () => {
		expect(validarArchivoVisor({ name: 'pieza.stl', size: 1 * MB })).toBe('ok');
		expect(validarArchivoVisor({ name: 'Pieza.3MF', size: 50 * MB })).toBe('ok');
	});

	it('rechaza otros tipos (también OBJ y archivos sin extensión)', () => {
		expect(validarArchivoVisor({ name: 'foto.jpg', size: MB })).toBe('tipo');
		expect(validarArchivoVisor({ name: 'modelo.obj', size: MB })).toBe('tipo');
		expect(validarArchivoVisor({ name: 'stl', size: MB })).toBe('tipo');
		expect(validarArchivoVisor({ name: 'pieza.stl.zip', size: MB })).toBe('tipo');
	});

	it('marca tamaño con más de 50 MB', () => {
		expect(validarArchivoVisor({ name: 'grande.stl', size: 50 * MB + 1 })).toBe('tamano');
	});

	it('revisa el tipo antes que el tamaño', () => {
		expect(validarArchivoVisor({ name: 'grande.obj', size: 80 * MB })).toBe('tipo');
	});
});

describe('viewerState', () => {
	beforeEach(() => {
		viewerState.reiniciar();
	});

	it('empieza vacío y sin ejemplo', () => {
		expect(get(viewerState)).toEqual({ vista: { fase: 'empty' }, ejemplo: null });
	});

	it('archivo propio: loading → progreso → loaded', () => {
		const carga = viewerState.abrirArchivo({ name: 'soporte.stl', size: MB });
		expect(carga).not.toBeNull();
		expect(get(viewerState).vista).toMatchObject({
			fase: 'loading',
			nombre: 'soporte.stl',
			pct: 0,
			origen: 'archivo'
		});

		viewerState.progreso(carga!, 54.6);
		expect(get(viewerState).vista).toMatchObject({ fase: 'loading', pct: 55 });

		viewerState.listo(carga!);
		expect(get(viewerState)).toEqual({
			vista: { fase: 'loaded', nombre: 'soporte.stl', origen: 'archivo', carga },
			ejemplo: null
		});
	});

	it('limita el porcentaje entre 0 y 100', () => {
		const carga = viewerState.abrirArchivo({ name: 'a.stl', size: MB })!;
		viewerState.progreso(carga, 140);
		expect(get(viewerState).vista).toMatchObject({ pct: 100 });
		viewerState.progreso(carga, -5);
		expect(get(viewerState).vista).toMatchObject({ pct: 0 });
	});

	it('archivo inválido: queda en error sin empezar a cargar', () => {
		expect(viewerState.abrirArchivo({ name: 'foto.png', size: MB })).toBeNull();
		expect(get(viewerState).vista).toEqual({ fase: 'error', tipo: 'tipo' });

		expect(viewerState.abrirArchivo({ name: 'grande.3mf', size: 60 * MB })).toBeNull();
		expect(get(viewerState).vista).toEqual({ fase: 'error', tipo: 'tamano' });
	});

	it('el loader falla: error dañado', () => {
		const carga = viewerState.abrirArchivo({ name: 'roto.stl', size: MB })!;
		viewerState.fallo(carga);
		expect(get(viewerState).vista).toEqual({ fase: 'error', tipo: 'danado' });
	});

	it('ejemplo: marca la tarjeta y usa el nombre visible', () => {
		const carga = viewerState.abrirEjemplo('jarron');
		expect(get(viewerState)).toMatchObject({
			vista: { fase: 'loading', nombre: 'Jarrón', origen: 'ejemplo' },
			ejemplo: 'jarron'
		});
		viewerState.listo(carga);
		expect(get(viewerState)).toMatchObject({
			vista: { fase: 'loaded', nombre: 'Jarrón', origen: 'ejemplo' },
			ejemplo: 'jarron'
		});
	});

	it('un archivo propio desmarca el ejemplo', () => {
		viewerState.abrirEjemplo('santa');
		viewerState.abrirArchivo({ name: 'mio.stl', size: MB });
		expect(get(viewerState).ejemplo).toBeNull();
		viewerState.abrirEjemplo('miniatura');
		viewerState.abrirArchivo({ name: 'mio.txt', size: MB });
		expect(get(viewerState).ejemplo).toBeNull();
	});

	it('ignora el progreso y el resultado de una carga anterior', () => {
		const primera = viewerState.abrirEjemplo('santa');
		const segunda = viewerState.abrirEjemplo('miniatura');

		viewerState.progreso(primera, 80);
		viewerState.listo(primera);
		viewerState.fallo(primera);
		expect(get(viewerState)).toMatchObject({
			vista: { fase: 'loading', nombre: 'Miniatura', pct: 0, carga: segunda },
			ejemplo: 'miniatura'
		});
	});

	it('esActual solo es cierto para la carga en curso', () => {
		const primera = viewerState.abrirEjemplo('santa');
		expect(viewerState.esActual(primera)).toBe(true);
		const segunda = viewerState.abrirEjemplo('jarron');
		expect(viewerState.esActual(primera)).toBe(false);
		expect(viewerState.esActual(segunda)).toBe(true);
		viewerState.listo(segunda);
		expect(viewerState.esActual(segunda)).toBe(false);
	});

	it('"Probar otro" vuelve a vacío y corta la carga en curso', () => {
		const carga = viewerState.abrirEjemplo('santa');
		viewerState.reiniciar();
		expect(get(viewerState)).toEqual({ vista: { fase: 'empty' }, ejemplo: null });

		viewerState.listo(carga);
		expect(get(viewerState).vista).toEqual({ fase: 'empty' });
	});

	it('un error de validación también corta la carga en curso', () => {
		const carga = viewerState.abrirArchivo({ name: 'a.stl', size: MB })!;
		viewerState.abrirArchivo({ name: 'b.doc', size: MB });
		viewerState.listo(carga);
		expect(get(viewerState).vista).toEqual({ fase: 'error', tipo: 'tipo' });
	});
});
