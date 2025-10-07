<template>
    <div>
        <v-stepper v-model="pasoActual" vertical elevation="0">
            <div v-for="(paso) in pasosStepper" :key="'step-' + paso.step">

                <v-stepper-step :step="paso.step" :complete="pasoActual > paso.step" editable
                    @click="pasoActual = paso.step" :rules="[() => paso.valido() || 'Debe completar este paso.']">
                    {{ paso.titulo }}
                </v-stepper-step>
                <v-stepper-content :key="'content-' + paso.step" :step="paso.step">

                    <component :is="paso.componente" :caracterizacion="caracterizacion" :rules="rules"
                        :ref="'refPaso' + paso.step" :key="caracterizacion?.afiliado_id + '-' + paso.step" />

                    <!-- Botones de navegación -->
                    <v-card-actions>
                        <v-btn v-if="paso.step > 1" small color="primary" @click="pasoActual--">
                            Anterior
                        </v-btn>
                        <v-spacer />
                        <v-btn v-if="paso.step < pasosStepper.length" small color="primary" @click="pasoActual++">
                            Siguiente
                        </v-btn>
                        <v-btn v-if="paso.step === pasosStepper.length" small color="primary"
                            @click="guardarFormulario">
                            Guardar
                        </v-btn>
                    </v-card-actions>
                </v-stepper-content>
            </div>
        </v-stepper>
    </div>
</template>
<script>
import informacionGeneralFormularioEcis from '@/components/caracterizacion/caracterizacionEcis/informacionGeneralFormularioEcis.vue';
import caracterizacionFamiliaFormularioEcis from '@/components/caracterizacion/caracterizacionEcis/caracterizacionFamiliaFormularioEcis.vue';
import caracterizacionIntegrantesFormularioEcis from '@/components/caracterizacion/caracterizacionEcis/caracterizacionIntegrantesFormularioEcis.vue';
import caracterizacionEntornoFormularioEcis from '@/components/caracterizacion/caracterizacionEcis/caracterizacionEntornoFormularioEcis.vue';
import { mapActions } from 'vuex';

export default {
    components: {
        informacionGeneralFormularioEcis,
        caracterizacionFamiliaFormularioEcis,
        caracterizacionIntegrantesFormularioEcis,
        caracterizacionEntornoFormularioEcis
    },
    props: {
        caracterizacion: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            pasoActual: 1,
            pasosStepper: [
                {
                    step: 1,
                    titulo: '1. INFORMACIÓN GENERAL',
                    valido: () => this.validacionesStep[1],
                    componente: 'informacionGeneralFormularioEcis'
                },
                {
                    step: 2,
                    titulo: '2. CARACTERIZACIÓN DE LA FAMILIA',
                    valido: () => this.validacionesStep[2],
                    componente: 'caracterizacionFamiliaFormularioEcis'
                },
                {
                    step: 3,
                    titulo: '3. CARACTERIZACIÓN DE LOS INTEGRANTES DE LA FAMILIA',
                    valido: () => this.validacionesStep[3],
                    componente: 'caracterizacionIntegrantesFormularioEcis'
                },
                {
                    step: 4,
                    titulo: '4. CARACTERIZACIÓN DEL ENTORNO',
                    valido: () => this.validacionesStep[4],
                    componente: 'caracterizacionEntornoFormularioEcis'
                }
            ],
            validacionesStep: {
                1: true,
                2: true,
                3: true,
                4: true,
            },
            mensajeError: "Hay errores en este paso.",
            rules: {
                obligatorio: v => v !== null && v !== undefined && v !== '' || 'Este campo es obligatorio.',
                celularOtelefono: v => {
                    if (!v) return true;
                    return /^\+?\d{1,4}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{3,5}[-.\s]?\d{3,5}$/.test(v)
                        || 'El celular o teléfono debe ser válido';
                },
                correoElectronico: v => {
                    if (!v) return true;
                    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
                        || 'El correo electrónico debe ser válido';
                },
                minCaracteres: v => !!v && v.length >= 10 || 'Este campo debe tener al menos 10 caracteres.',
                alMenosUnElemento: v => Array.isArray(v) && v.length > 0 || 'Debe seleccionar al menos un ítem.',
            },

        }
    },
    methods: {
        ...mapActions('app', ['setPreload']),

        async validarFormulario() {
            let todoValido = true;

            for (const paso of this.pasosStepper) {
                const refComp = this.$refs['refPaso' + paso.step]?.[0];
                const esValido = await refComp?.$refs?.form?.validate?.();

                this.validacionesStep[paso.step] = !!esValido;

                if (!esValido) {
                    todoValido = false;
                }
            }

            if (!todoValido) {
                this.$toast.error('Debe completar los pasos del formulario para continuar.');
            }

            return todoValido;
        },

        async guardarFormulario() {
            const esValido = await this.validarFormulario();
            if (!esValido) return;

            try {
                this.setPreload(true);

                const camposMultiples = ['factores_entorno_vivienda', 'intervenciones_pendientes', 'escenarios_riesgo'];
                const payload = {
                    afiliado_id: this.caracterizacion.afiliado_id,
                    ...this.caracterizacion,
                };

                for (const campo of camposMultiples) {
                    if (Array.isArray(this.caracterizacion[campo])) {
                        payload[campo] = JSON.stringify(this.caracterizacion[campo]);
                    }
                }


                await this.$axios.post('/caracterizacion/guardar-caracterizacion-ecis', payload);

                this.$toast.success('Caracterización guardada correctamente');

                // this.$emit('limpiarCaracterizacion');

            } catch (error) {
                this.$toast.error('Error al guardar la caracterización');
            } finally {
                this.setPreload(false);
            }

        },
    }
}
</script>