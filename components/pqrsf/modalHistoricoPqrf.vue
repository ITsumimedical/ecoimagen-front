<template>
    <v-dialog v-model="mostrarModalHistorico" persistent max-width="1400px">
        <v-card>
            <v-alert text dense border="left" type="info" icon="mdi-timeline-clock-outline" class="text-center">
                <b>Histórico de PQRSF de {{
                    [afiliado?.primer_nombre, afiliado?.segundo_nombre, afiliado?.primer_apellido,
                    afiliado?.segundo_apellido]
                    .filter(Boolean)
                    .join(' ')
                    }}</b>
            </v-alert>
            <v-card-text>
                <v-row dense>
                    <v-col cols="12" md="12" sm="12">
                        <v-expansion-panels>
                            <v-expansion-panel v-for="item in historicoPQRFs" :key="item.id">
                                <v-expansion-panel-header>
                                    <v-row dense>
                                        <v-col cols="12" md="3" sm="6" align="center">
                                            <b>N° de Radicado:</b> {{ item?.id }}
                                        </v-col>
                                        <v-col cols="12" md="3" sm="6" align="center">
                                            <b>Tipo de Requerimiento:</b>
                                            {{ item?.solicitud?.nombre ?? "-" }}
                                        </v-col>
                                        <v-col cols="12" md="3" sm="6" align="center">
                                            <b>Fecha de Radicado:</b>
                                            {{
                                                $moment(item?.created_at).format("dddd, D MMMM YYYY") ??
                                            "-"
                                            }}
                                        </v-col>
                                        <v-col cols="12" md="3" sm="6" align="center">
                                            <b>Estado:</b>
                                            <v-chip small dark :color="obtenerColorEstado(item?.estado?.id)">
                                                {{ item?.estado?.nombre ?? "-" }}
                                            </v-chip>
                                        </v-col>
                                    </v-row>
                                </v-expansion-panel-header>
                                <v-expansion-panel-content>
                                    <v-row dense class="mt-2">
                                        <v-col cols="12" md="3" sm="6">
                                            <v-text-field dense outlined label="N° de Radicado" :value="item?.id ?? '-'"
                                                readonly></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="3" sm="6">
                                            <v-text-field dense outlined label="Afiliado" :value="[
                                                item?.afiliado?.primer_nombre,
                                                item?.afiliado?.segundo_nombre,
                                                item?.afiliado?.primer_apellido,
                                                item?.afiliado?.segundo_apellido
                                            ].filter(Boolean).join(' ') || '-'" readonly></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="3" sm="6">
                                            <v-text-field dense outlined label="¿Quién Generó?"
                                                :value="item?.quien_genera ?? '-'" readonly></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="3" sm="6">
                                            <v-text-field dense outlined label="Correo Electrónico"
                                                :value="item?.correo ?? '-'" readonly></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="3" sm="6">
                                            <v-text-field dense outlined label="Teléfono o Celular"
                                                :value="item?.telefono ?? '-'" readonly></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="3" sm="6">
                                            <v-text-field dense outlined label="Tipo de Requerimiento"
                                                :value="item?.solicitud?.nombre ?? '-'" readonly></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="3" sm="6">
                                            <v-text-field dense outlined label="Canal"
                                                :value="item?.canal?.nombre ?? '-'" readonly></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="3" sm="6">
                                            <v-text-field dense outlined label="Registrado Por" :value="[
                                                item?.user?.operador?.nombre,
                                                item?.user?.operador?.apellido
                                            ].filter(Boolean).join(' ') || '-'" readonly></v-text-field>
                                        </v-col>

                                        <v-col cols="12" md="12" sm="12">
                                            <v-textarea dense outlined label="Descripción del Caso"
                                                :value="item?.descripcion ?? '-'" readonly auto-grow></v-textarea>
                                        </v-col>
                                    </v-row>
                                </v-expansion-panel-content>
                            </v-expansion-panel>
                        </v-expansion-panels>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error" small dark @click="cerrarModal"> Cerrar </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
import { mapActions } from "vuex";

export default {
    props: {
        mostrarModalHistorico: {
            type: Boolean,
            default: false,
        },
        afiliado: {
            type: Object,
            default: () => { },
        },
    },
    data() {
        return {
            historicoPQRFs: [],
        };
    },
    watch: {
        mostrarModalHistorico(newValue) {
            if (newValue) {
                this.listarHistoricoPQRFs();
            }
        },
    },
    methods: {
        ...mapActions("app", ["setPreload"]),

        cerrarModal() {
            this.historicoPQRFs = [];
            this.$emit("update:mostrarModalHistorico", false);
        },

        listarHistoricoPQRFs() {
            this.setPreload(true);

            this.$axios
                .get(`/formularios-pqrsf/historial/${this.afiliado?.numero_documento}`)
                .then((res) => {
                    this.historicoPQRFs = res.data.data;
                })
                .catch((error) => {
                    this.$toast.error(
                        "Error al cargar el historico de PQRFs del afiliado"
                    );
                })
                .finally(() => {
                    this.setPreload(false);
                });
        },

        obtenerColorEstado(estadoId) {
            switch (estadoId) {
                case 2:
                case 5:
                case 20:
                case 30:
                    return "error";
                case 6:
                case 15:
                case 18:
                    return "info";
                case 10:
                    return "warning";
                case 17:
                    return "success";
                default:
                    return "blue-grey";
            }
        },
    },
};
</script>
