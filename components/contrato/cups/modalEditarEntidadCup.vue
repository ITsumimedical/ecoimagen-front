<template>
    <v-dialog v-model="mostrarModalEditarEntidadCup" persistent max-width="1200px">
        <v-card>
            <v-alert dense text border="left" color="primary" icon="mdi-pencil" class="text-center">
                <b>Editar</b>
            </v-alert>
            <v-card-text>
                <v-form ref="formEditarCupEntidad">
                    <v-row dense>
                        <v-col cols="12" sm="6" md="3">
                            <v-select dense outlined label="Diagnóstico Requerido *" :items="opcionesSiNo"
                                :rules="[rules.obligatorio]" v-model="cupEntidadActual.diagnostico_requerido" />
                        </v-col>
                        <v-col cols="12" sm="6" md="3">
                            <v-select dense outlined label="Nivel de Ordenamiento *" :items="opcionesNiveles"
                                :rules="[rules.obligatorio]" v-model="cupEntidadActual.nivel_ordenamiento" />
                        </v-col>
                        <v-col cols="12" sm="6" md="3">
                            <v-select dense outlined label="Nivel de Portabilidad *" :items="opcionesNiveles"
                                :rules="[rules.obligatorio]" v-model="cupEntidadActual.nivel_portabilidad" />
                        </v-col>
                        <v-col cols="12" sm="6" md="3">
                            <v-select dense outlined label="Requiere Auditoria *" :items="opcionesSiNo"
                                :rules="[rules.obligatorio]" v-model="cupEntidadActual.requiere_auditoria" />
                        </v-col>
                        <v-col cols="12" sm="6" md="3">
                            <v-text-field dense outlined label="Periodicidad *" type="number"
                                v-model="cupEntidadActual.periodicidad"
                                :rules="[rules.obligatorio, rules.noNegativo]" />
                        </v-col>
                        <v-col cols="12" sm="6" md="3">
                            <v-text-field dense outlined label="Cantidad Máxima de Ordenamiento *" type="number"
                                v-model="cupEntidadActual.cantidad_max_ordenamiento"
                                :rules="[rules.obligatorio, rules.noNegativo]" />
                        </v-col>
                        <v-col cols="12" sm="6" md="3">
                            <v-select dense outlined label="Copago *" :items="opcionesSiNo" :rules="[rules.obligatorio]"
                                v-model="cupEntidadActual.copago" />
                        </v-col>
                        <v-col cols="12" sm="6" md="3">
                            <v-select dense outlined label="Moderadora *" :items="opcionesSiNo"
                                :rules="[rules.obligatorio]" v-model="cupEntidadActual.moderadora" />
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn small dark color="error" @click="cerrarModal">Salir</v-btn>
                <v-btn small dark color="success" @click="enviarFormulario">Guardar</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
import { mapActions } from 'vuex';
export default {

    props: {
        cupEntidadSeleccionado: {
            type: Object,
            default: {}
        },
        mostrarModalEditarEntidadCup: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            cupEntidadActual: {},
            rules: {
                obligatorio: v => v !== null && v !== undefined && v !== '' || 'Este campo es obligatorio',
                noNegativo: v => v >= 0 || 'Este campo debe ser un número positivo',
            },
            opcionesSiNo: [
                { text: 'Si', value: true },
                { text: 'No', value: false },
            ],
            opcionesNiveles: [
                0, 1, 2, 3, 4
            ]
        }
    },
    watch: {
        mostrarModalEditarEntidadCup(newValue) {
            if (newValue) {
                this.listarDetallesCupEntidad();
            }
        }
    },
    methods: {
        ...mapActions('app', ['setPreload']),

        cerrarModal() {
            this.cupEntidadActual = {};
            this.$refs.formEditarCupEntidad.resetValidation();
            this.$emit('update:mostrarModalEditarEntidadCup', false);
        },

        async listarDetallesCupEntidad() {
            try {
                this.setPreload(true);

                const response = await this.$axios.get(`/cup/listar-detalles-cup-entidad/${this.cupEntidadSeleccionado.id}`);

                this.cupEntidadActual = response.data;

            } catch (error) {
                this.$toast.error('Ocurrió un error al listar los detalles.')
            } finally {
                this.setPreload(false);
            }
        },

        async enviarFormulario() {
            if (!this.$refs.formEditarCupEntidad.validate()) return;
            try {
                this.setPreload(true);

                const data = {
                    diagnostico_requerido: this.cupEntidadActual.diagnostico_requerido,
                    nivel_ordenamiento: this.cupEntidadActual.nivel_ordenamiento,
                    nivel_portabilidad: this.cupEntidadActual.nivel_portabilidad,
                    requiere_auditoria: this.cupEntidadActual.requiere_auditoria,
                    periodicidad: parseInt(this.cupEntidadActual.periodicidad),
                    cantidad_max_ordenamiento: parseInt(this.cupEntidadActual.cantidad_max_ordenamiento),
                    copago: this.cupEntidadActual.copago,
                    moderadora: this.cupEntidadActual.moderadora
                };

                await this.$axios.patch(`/cup/editar-cup-entidad/${this.cupEntidadSeleccionado.id}`, data);

                this.$toast.success('Se ha actualizado la información correctamente');

                this.$emit('recargarDatos')

                this.cerrarModal();

            } catch (error) {
                this.$toast.error('Ocurrió un error al actualizar la información');
            } finally {
                this.setPreload(false);
            }
        }
    }
}
</script>
