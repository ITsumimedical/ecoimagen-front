<template>
    <div>
        <v-dialog v-model="mostrarModalAdjuntos" persistent max-width="1200px">
            <v-card>
                <v-alert text dense border="left" type="info" icon="mdi-file-eye" class="text-center">
                    <b>Adjuntos de la Novedad No. {{ novedad?.id }}</b>
                </v-alert>
                <v-card-text>
                    <v-row dense>
                        <v-col cols="12" sm="12" md="12" v-if="novedadAfiliado.afiliado">
                            <AfiliadoComponente :afiliado="novedadAfiliado.afiliado" :modoDetalle="true"
                                :modoEdicion="true" :mostrarClasificaciones="true"
                                @respuestaComponente="componente = null" />
                        </v-col>
                        <v-col cols="12" sm="12" md="12" class="my-4">
                            <v-divider></v-divider>
                        </v-col>
                        <v-col cols="12" sm="12" md="12">
                            <v-alert text dense border="left" type="success" icon="mdi-file-document-multiple"
                                class="text-center">
                                <b>Adjuntos</b>
                            </v-alert>
                        </v-col>
                        <v-col cols="12" sm="12" md="12" v-if="novedadAfiliado.adjuntos">
                            <v-data-table :headers="headersAdjuntos" :items="novedadAfiliado.adjuntos" dense
                                no-data-text="Esta novedad no tiene archivos adjuntos.">
                                <template v-slot:[`item.created_at`]="{ item }">
                                    {{ $moment(item.created_at).format("DD/MM/YYYY") }}
                                </template>
                                <template v-slot:[`item.acciones`]="{ item }">
                                    <v-tooltip top>
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-icon color="success" v-bind="attrs" v-on="on"
                                                @click="consultarAdjunto(item.ruta)">mdi-file-download</v-icon>
                                        </template>
                                        <span>Ver adjunto</span>
                                    </v-tooltip>
                                </template>
                            </v-data-table>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn small color="error" @click="cerrarModal">Cerrar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import { mapActions } from "vuex";
import AfiliadoComponente from "@/components/afiliado/FormularioAfiliadoComponente.vue";

export default {
    props: {
        mostrarModalAdjuntos: {
            type: Boolean,
            default: false,
        },
        novedad: {
            type: Object,
            default: () => { },
        },
    },
    components: {
        AfiliadoComponente,
    },
    data() {
        return {
            novedadAfiliado: {},
            headersAdjuntos: [
                {
                    text: "Nombre",
                    align: "center",
                    value: "nombre",
                },
                {
                    text: "Fecha",
                    align: "center",
                    value: "created_at",
                },
                {
                    text: "Acciones",
                    align: "center",
                    value: "acciones",
                },
            ],
        };
    },
    watch: {
        mostrarModalAdjuntos(newValue) {
            if (newValue) {
                this.consultarNovedad();
            }
        },
    },
    methods: {
        ...mapActions("app", ["setPreload"]),

        cerrarModal() {
            this.$emit("update:mostrarModalAdjuntos", false);
        },

        consultarNovedad() {
            this.setPreload(true);
            this.$axios
                .get(`/novedad-afiliado/buscarNovedadPorId/${this.novedad.id}`)
                .then((res) => {
                    this.novedadAfiliado = res.data;
                })
                .catch((error) => {
                    this.$toast.error("Error al cargar la novedad");
                })
                .finally(() => {
                    this.setPreload(false);
                });
        },

        async consultarAdjunto(ruta) {
            this.setPreload(true);

            try {
                let adj = await this.$adjuntos(ruta);
                let blob = new Blob([adj[1]], {
                    type: adj[0],
                });
                let link = document.createElement("a");
                link.href = window.URL.createObjectURL(blob);
                window.open(link.href, "_blank");
            } catch (error) {
                this.$toast.error("Error al cargar el archivo adjunto");
            } finally {
                this.setPreload(false);
            }
        },
    },
};
</script>
