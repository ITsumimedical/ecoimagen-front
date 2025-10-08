<template>
    <div class="text-center">
        <v-dialog v-model="dialogOrdenamiento" width="1400" persistent>
            <template v-slot:activator="{ on, attrs }" v-if="habilitarBoton">
                <v-btn color="info" class="mr-2" small dark v-bind="attrs" v-on="on">Ordenamiento
                    <v-icon right small>mdi-bell
                    </v-icon>
                </v-btn>
            </template>
            <v-card>

                <v-card outlined class="pa-3 mb-4">
                    <v-card-title class="subtitle-2 font-weight-medium py-1 mb-1">
                        <v-icon class="mr-2" color="primary">mdi-information-variant</v-icon>
                        Información del paciente
                    </v-card-title>

                    <v-divider class="mb-3"></v-divider>

                    <v-row dense>
                        <v-col cols="12" sm="6" md="4" class="mb-2">
                            <div class="d-flex align-start">
                                <v-icon color="blue-grey" class="mr-2 mt-1">mdi-account</v-icon>
                                <v-divider vertical class="mx-2" style="height: auto;"></v-divider>
                                <div>
                                    <div class="text-caption font-weight-bold">Nombre completo afiliado:</div>
                                    <div class="text-caption">
                                        {{
                                            [afiliado.primer_nombre, afiliado.segundo_nombre, afiliado.primer_apellido,
                                            afiliado.segundo_apellido]
                                        .filter(Boolean)
                                        .join(' ')
                                        }}
                                    </div>
                                </div>
                            </div>
                        </v-col>

                        <v-col cols="12" sm="6" md="4" class="mb-2">
                            <div class="d-flex align-start">
                                <v-icon color="blue-grey" class="mr-2 mt-1">mdi-card-account-details</v-icon>
                                <v-divider vertical class="mx-2" style="height: auto;"></v-divider>
                                <div>
                                    <div class="text-caption font-weight-bold">Documento de identificación:</div>
                                    <div class="text-caption">{{ afiliado.numero_documento }}</div>
                                </div>
                            </div>
                        </v-col>

                        <v-col cols="12" sm="6" md="4" class="mb-2">
                            <div class="d-flex align-start">
                                <v-icon color="blue-grey" class="mr-2 mt-1">mdi-gender-male-female</v-icon>
                                <v-divider vertical class="mx-2" style="height: auto;"></v-divider>
                                <div>
                                    <div class="text-caption font-weight-bold">Sexo biológico:</div>
                                    <div class="text-caption">{{ afiliado.sexo === "M" ? "Masculino" : "Femenino" }}
                                    </div>
                                </div>
                            </div>
                        </v-col>

                        <v-col cols="12" sm="6" md="4" class="mb-2">
                            <div class="d-flex align-start">
                                <v-icon color="blue-grey" class="mr-2 mt-1">mdi-domain</v-icon>
                                <v-divider vertical class="mx-2" style="height: auto;"></v-divider>
                                <div>
                                    <div class="text-caption font-weight-bold">Entidad:</div>
                                    <div class="text-caption">{{ entidad || "Sin entidad" }}</div>
                                </div>
                            </div>
                        </v-col>

                        <v-col cols="12" sm="6" md="4" class="mb-2">
                            <div class="d-flex align-start">
                                <v-icon color="blue-grey" class="mr-2 mt-1">mdi-map-marker</v-icon>
                                <v-divider vertical class="mx-2" style="height: auto;"></v-divider>
                                <div>
                                    <div class="text-caption font-weight-bold">Municipio:</div>
                                    <div class="text-caption">{{ afiliado.municipio_atencion?.nombre || "Sin municipio"
                                        }}</div>
                                </div>
                            </div>
                        </v-col>

                        <v-col cols="12" sm="6" md="4" class="mb-2">
                            <div class="d-flex align-start">
                                <v-icon color="blue-grey" class="mr-2 mt-1">mdi-map</v-icon>
                                <v-divider vertical class="mx-2" style="height: auto;"></v-divider>
                                <div>
                                    <div class="text-caption font-weight-bold">Departamento:</div>
                                    <div class="text-caption">{{ afiliado.departamento_atencion?.nombre || "Sin departamento" }}
                                    </div>
                                </div>
                            </div>
                        </v-col>

                        <v-col cols="12" sm="6" md="4" class="mb-2">
                            <div class="d-flex align-start">
                                <v-icon color="blue-grey" class="mr-2 mt-1">mdi-hospital-building</v-icon>
                                <v-divider vertical class="mx-2" style="height: auto;"></v-divider>
                                <div>
                                    <div class="text-caption font-weight-bold">IPS primaria:</div>
                                    <div class="text-caption">{{ afiliado.ips?.nombre || "Sin IPS asignada" }}</div>
                                </div>
                            </div>
                        </v-col>

                        <v-col cols="12" sm="6" md="4" class="mb-2">
                            <div class="d-flex align-start">
                                <v-icon color="blue-grey" class="mr-2 mt-1">mdi-account-badge</v-icon>
                                <v-divider vertical class="mx-2" style="height: auto;"></v-divider>
                                <div>
                                    <div class="text-caption font-weight-bold">Tipo de cotizante:</div>
                                    <div class="text-caption">{{ afiliado.tipo_afiliado?.nombre || "Sin IPS asignada" }}</div>
                                </div>
                            </div>
                        </v-col>
                    </v-row>
                </v-card>

                <v-card-text>
                    <div v-if="
                        afiliado.tipo_afiliado_id === 1 ||
                        afiliado.tipo_afiliado_id === 3 ||
                        afiliado.tipo_afiliado_id === 6
                    ">
                        <v-alert dense text border="left" type="info">
                            <b>El afiliado es BENEFICIARIO por lo tanto no tiene derecho a
                                INCAPACIDADES</b>
                        </v-alert>
                    </div>
                    <v-row>
                        <v-col cols="12" sm="12" md="12" class="pb-0">
                            <v-select v-model="comp" label="Tipo Ordenamiento" outlined dense :items="tipoOrdenamiento"
                                :item-text="'text'" :item-value="'value'"
                                :disabled="!Number.isInteger(consulta)"></v-select>
                        </v-col>
                    </v-row>
                    <component :is="comp" :consulta="consulta" :afiliado="afiliado" @cerrarModal="cerrarOrdenamiento()">
                    </component>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn small color="error" @click="cerrarOrdenamiento()">Cerrar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
import Medicamentos from "~/components/ordenamiento/articulos.vue";
import Procedimientos from "~/components/ordenamiento/procedimientos.vue";
import Incapacidades from "~/components/ordenamiento/incapacidades.vue";
import Oncologia from "~/components/ordenamiento/oncologia.vue";
import CodigosPropios from "~/components/ordenamiento/codigosPropios.vue";
import recomendaciones from "~/components/ordenamiento/recomendacionesConsulta.vue";
import MedicamentosInternos from "~/components/ordenamiento/articulosInternos.vue";
import PaqueteOrdenamiento from "~/components/ordenamiento/paquetesOrdenamiento.vue";

export default {
    middleware({ $can, redirect }) {
        if (!$can("blog.vista")) {
            return redirect("/");
        }
    },
    name: "ordenamiento",
    components: {
        Medicamentos,
        Procedimientos,
        Incapacidades,
        Oncologia,
        CodigosPropios,
        recomendaciones,
        MedicamentosInternos,
        PaqueteOrdenamiento,
    },

    props: ["consulta", "dialog", "habilitarBoton"],
    data: () => ({
        dialogOrdenamiento: false,
        comp: "",
        afiliado: [],
        tipoOrdenamiento: [],
        entidad: "",
    }),

    watch: {
        consulta(val) {
            this.obtenerInformacionConsulta();
        },
        dialog() {
            this.dialogOrdenamiento = this.dialog;
        },
    },

    mounted() {
        this.obtenerInformacionConsulta();
    },

    methods: {
        validarErrores() {
            return [];
        },

        abrirDialogo() {
            this.dialogOrdenamiento = true
        },
        cerrarOrdenamiento() {
            this.comp = "";
            this.$emit("respuestaComponente");
            this.dialogOrdenamiento = false;
        },
        obtenerInformacionConsulta() {
            if (!this.consulta) return;

            this.$axios.get("/consultas/consulta/" + this.consulta).then((res) => {
                const { tipo_consulta_id, afiliado } = res.data;
                const tipoAfiliado = parseInt(afiliado.tipo_afiliado_id);

                if (tipoAfiliado === 4) {
                    return this.$toast.error("Este paciente está fallecido.");
                }

                const baseOrdenamiento = [
                    { text: "Medicamentos", value: "Medicamentos" },
                    { text: "Procedimientos", value: "Procedimientos" },
                    { text: "Paquete de ordenamiento", value: "PaqueteOrdenamiento" },
                    { text: "Oncología", value: "Oncologia" },
                    { text: "Otros Servicios", value: "CodigosPropios" },
                    { text: "Recomendaciones", value: "recomendaciones" }
                ];

                const ordenamientoExterno = [
                    { text: "Medicamentos - Externo", value: "Medicamentos" },
                    { text: "Medicamentos - IntraHospitalario", value: "MedicamentosInternos" },
                    { text: "Procedimientos", value: "Procedimientos" },
                    { text: "Oncología", value: "Oncologia" },
                    { text: "Incapacidades", value: "Incapacidades" },
                    { text: "Otros Servicios", value: "CodigosPropios" },
                    { text: "Recomendaciones", value: "recomendaciones" }
                ];

                const ordenamientoConIncapacidades = [
                    ...baseOrdenamiento.slice(0, 3),
                    { text: "Incapacidades", value: "Incapacidades" },
                    ...baseOrdenamiento.slice(3)
                ];

                const esConsultaUrgencias = parseInt(tipo_consulta_id) === 88;
                const esAfiliadoCotizante = tipoAfiliado === 2;

                if (esConsultaUrgencias && esAfiliadoCotizante) {
                    this.tipoOrdenamiento = ordenamientoExterno;
                } else if (!esConsultaUrgencias && esAfiliadoCotizante) {
                    this.tipoOrdenamiento = ordenamientoConIncapacidades;
                } else {
                    this.tipoOrdenamiento = baseOrdenamiento;
                }

                this.afiliado = afiliado;
                this.entidad = afiliado.entidad.nombre;
            });
        },

    },
};
</script>
