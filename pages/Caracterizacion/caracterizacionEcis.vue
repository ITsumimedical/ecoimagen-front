<template>
    <div>
        <v-card>
            <v-card-title>
                <v-toolbar flat>
                    <v-toolbar-title>
                        <div class="d-flex align-center">
                            <img src="/images/ojo.svg" alt="" height="50px" width="50px">
                            <span>ECIS - Caracterización</span>
                        </div>
                    </v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                </v-toolbar>
            </v-card-title>
            <v-card-text>
                <!-- Búsqueda de caracterización -->
                <busqueda-caracterizacion-ecis ref="busquedaCaracterizacion"
                    @caracterizacion-encontrada="manejarCaracterizacion"
                    @limpiar-caracterizacion="limpiarCaracterizacion" />
                <!-- Imprimir PDF -->
                <v-row dense v-if="caracterizacionEcis" class="px-4">
                    <v-col cols="12" sm="12" md="12">
                        <v-btn dark block color="success" @click="descargarCaracterizacion()">
                            Ver PDF
                            <v-icon right>mdi-file-download-outline</v-icon>
                        </v-btn>
                    </v-col>
                </v-row>
                <v-divider class="mb-4 mx-4"></v-divider>
                <!-- Formulario ECIS -->
                <formulario-ecis :caracterizacion="caracterizacionEcis" v-if="caracterizacionEcis"
                    @limpiarCaracterizacion="limpiarCaracterizacion" />

            </v-card-text>
        </v-card>
    </div>
</template>
<script>
import FormularioEcis from "~/components/caracterizacion/caracterizacionEcis/formularioEcis.vue";
import BusquedaCaracterizacionEcis from '~/components/caracterizacion/caracterizacionEcis/busquedaCaracterizacionEcis.vue'
import { mapActions } from 'vuex';

export default {
    middleware({ $can, redirect }) {
        if (!$can('caracterizacion.ecis')) {
            return redirect('/')
        }
    },
    components: {
        FormularioEcis,
        BusquedaCaracterizacionEcis
    },
    data() {
        return {
            caracterizacionEcis: null,
        }
    },
    methods: {
        ...mapActions('app', ['setPreload']),

        manejarCaracterizacion(caracterizacionEcis) {
            this.caracterizacionEcis = caracterizacionEcis;
        },

        limpiarCaracterizacion() {
            this.caracterizacionEcis = null;
        },

        async descargarCaracterizacion() {
            const esValido = await this.validarCaracterizacion();

            if (esValido) {
                this.imprimirPDF();
            } else {
                this.$toast.error('El afiliado no tiene una caracterización válida');
            }
        },

        async validarCaracterizacion() {

            this.setPreload(true);
            try {
                const { data } = await this.$axios.get(`/caracterizacion/validar-caracterizacion-ecis/${this.caracterizacionEcis.afiliado_id}`);

                return data

            } catch (error) {
                this.$toast.error('Error al validar la caracterización');
            } finally {
                this.setPreload(false);
            }
        },

        async imprimirPDF() {

            const payload = {
                afiliadoId: this.caracterizacionEcis.afiliado_id,
                tipo: 'caracterizacionEcis'
            };

            this.setPreload(true);

            try {

                const { data } = await this.$axios.post('/pdf', payload, {
                    responseType: 'arraybuffer'
                });

                const blob = new Blob([data], { type: 'application/pdf' });
                const url = window.URL.createObjectURL(blob);
                const newTab = window.open(url, '_blank');
                newTab.onload = () => {
                    window.URL.revokeObjectURL(url);
                };
            } catch (error) {
                this.$toast.error('Error al generar el PDF');
            } finally {
                this.setPreload(false);
            }
        }
    }
}
</script>