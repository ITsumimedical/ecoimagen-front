<template>

    <v-card>

        <v-card-title>
            <v-toolbar flat>
                <v-toolbar-title>
                    <div class="d-flex align-center">
                        <img src="/images/ojo.svg" alt="" height="50px" width="50px" />
                        <span>Reportes - Certificados</span>
                    </div>
                </v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
            </v-toolbar>
        </v-card-title>

        <v-divider></v-divider>

        <v-row dense>
            <v-col cols="12" sm="12" md="12">

                <v-col cols="12" sm="12" md="12" align="center">
                    <v-alert class="text-center" dense text type="info" icon="mdi-file-check"
                        border="left"><b>CERTIFICADOS
                            DE ATENCION Y DISPENSACIÓN</b>
                    </v-alert>
                </v-col>

                <v-card-text>
                    <v-row>
                        <v-col cols="12" md="3">
                            <v-text-field type="date" outlined dense v-model="formFiltro.fechaDesde" label="Fecha Desde"
                                required></v-text-field>
                        </v-col>
                        <v-col cols="12" md="3">
                            <v-text-field type="date" outlined dense v-model="formFiltro.fechasHasta"
                                label="Fecha Hasta" required></v-text-field>
                        </v-col>
                        <v-col cols="12" md="3">
                            <v-autocomplete :items="entidades" dense outlined v-model="formFiltro.entidad"
                                item-text="nombre" item-value="id" label="Entidad"></v-autocomplete>
                        </v-col>
                        <v-col cols="12" md="3">
                            <v-text-field label="Correo electronico" dense outlined
                                v-model="formFiltro.correo"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="3">
                            <v-select v-if="[1, 3].includes(formFiltro.entidad)" dense outlined
                                :items="bodegas[formFiltro.entidad]" v-model="formFiltro.bodega"
                                label="Bodega"></v-select>
                        </v-col>
                    </v-row>

                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="success" @click="generarCertificados()"><v-icon>mdi-email-arrow-right</v-icon>  Generar</v-btn>
                </v-card-actions>

            </v-col>
        </v-row>

    </v-card>

</template>
<script>
import { mapActions } from "vuex";

export default {
    name: 'certificados',
    data() {
        return {
            entidades: [],
            bodegas: {
                '1': ['RAMEDICAS', 'SUMIMEDICAL'],
                '3': ['SUMIMEDICAL']
            },
            formFiltro: {
                fechaDesde: null,
                fechasHasta: null,
                entidad: null,
                bodega: null,
                correo: null,
            },
        }
    },
    mounted() {
        this.listarEntidades();
    },
    watch: {
        'formFiltro.entidad'(val) {
            if (![1, 3].includes(val)) {
                this.formFiltro.bodega = null;
            }
        }
    },
    methods: {
        ...mapActions('app', ['setPreload']),
        listarEntidades() {
            this.setPreload(true);
            this.$axios.get('entidad/listar').then((response) => {
                this.entidades = response.data;
            }).catch(e => console.log(e.response)).finally(() => { this.setPreload(false) })
        },

        validarFormulario() {
            const fechaInicial = new Date(this.formFiltro.fechaDesde);
            const fechaFinal = new Date(this.formFiltro.fechasHasta);

            if (isNaN(fechaInicial) || isNaN(fechaFinal)) {
                this.$toast.error("Las fechas ingresadas no son válidas.");
                return false;
            }

            if (fechaFinal < fechaInicial) {
                this.$toast.error("La fecha inicial no puede ser mayor a la fecha final.");
                return false;
            }

            const diferenciaEnMilisegundos = fechaFinal - fechaInicial;
            const diferenciaEnDias = diferenciaEnMilisegundos / (1000 * 60 * 60 * 24);

            if (diferenciaEnDias > 31) {
                this.$toast.error("El rango de fechas no puede ser mayor a un mes.");
                return false;
            }

            if (!this.formFiltro.entidad) {
                this.$toast.error('Debe seleccionar una Entidad');
                return false;
            }

            if (!this.formFiltro.correo) {
                this.$toast.error('Seleccione un Correo para enviar el Certificado');
                return false;
            }

            if ([1, 3].includes(this.formFiltro.entidad)) {
                if (!this.formFiltro.bodega) {
                    this.$toast.error('Seleccione una Bodega')
                    return false;
                }
            }

            return true;

        },

        limpiarFormulario() {
            this.formFiltro = {
                fechaDesde: null,
                fechasHasta: null,
                entidad: null,
                bodega: null,
                correo: null,
            }
        },

        generarCertificados() {

            if (!this.validarFormulario()) {
                return;
            }

            this.$swal({
                title: "Certificados",
                text: "Señor usuario sus Certificados se enviaran a su correo diligenciado en el formulario, Por favor revise su bandeja de entrada",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#28a745",
                cancelButtonColor: "#d33",
                confirmButtonText: "Enviar",
                cancelButtonText: "Cancelar",
            }).then((result) => {
                if (result.value) {
                    this.setPreload(true);
                    this.$axios.post('certificado/certificados-masivos', this.formFiltro)
                        .then(() => {
                            this.$toast.success("Correo Enviado Correctamente ");
                            this.limpiarFormulario();
                        })
                        .catch((error) => {
                            this.$toast.error("Ocurrió un error al Enviar el Correo");
                            console.log(error);
                        })
                        .finally(() => {
                            this.setPreload(false)
                        });
                }
            });
        }
    }
}
</script>
