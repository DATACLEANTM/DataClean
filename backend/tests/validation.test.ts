// tests/validation.test.ts
import { validateOutOfRange } from '../src/modules/validation/rules/out-of-range.rule';
import { validateReferentialConsistency } from '../src/modules/validation/rules/referential.rule';
import { validateBusinessContradictions } from '../src/modules/validation/rules/business-contradictions.rule';

describe('Validaciones Avanzadas (Reglas de Negocio)', () => {

    // Prueba de Fuera de Rango
    it('Debe detectar un stock negativo como un error de OUT_OF_RANGE', () => {
        const filaMala = { stock: -15, edad: 25 };
        const errores = validateOutOfRange(filaMala, 1);

        expect(errores.length).toBe(1);
        expect(errores[0].fieldName).toBe('stock');
        expect(errores[0].errorType).toBe('OUT_OF_RANGE');
    });

    // Prueba de Consistencia Referencial
    it('Debe detectar un pedido huérfano sin cliente asociado', () => {
        const filaHuerfana = { pedido_id: 'PED-100', cliente_id: '' };
        const errores = validateReferentialConsistency(filaHuerfana, 2);

        expect(errores.length).toBe(1);
        expect(errores[0].errorType).toBe('REFERENTIAL_ERROR');
    });

    // Prueba de Contradicción de Negocio
    it('Debe detectar contradicción lógica: Activo con Fecha de Baja', () => {
        const filaInconsistente = { estado: 'Activo', fecha_baja: '2026-05-10' };
        const errores = validateBusinessContradictions(filaInconsistente, 3);

        expect(errores.length).toBe(1);
        expect(errores[0].errorType).toBe('BUSINESS_CONTRADICTION');
    });

    it('Debe detectar incoherencia cronológica: Fecha final anterior a la inicial', () => {
        const cronologiaMala = { fecha_inicio: '2026-10-01', fecha_fin: '2026-05-01' };
        const errores = validateBusinessContradictions(cronologiaMala, 4);

        expect(errores.length).toBe(1);
        expect(errores[0].errorType).toBe('BUSINESS_CONTRADICTION');
    });
});