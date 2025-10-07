<template>
    <div>
        <v-dialog v-model="mostrarModalSolucionados" max-width="2000" persistent>
            <v-card>
                <v-alert text dense border="left" type="info" icon="mdi-message-check-outline" class="text-center">
                    <b>Detalles de la PQRF N° {{ PQRSFSeleccionada?.id }}</b>
                </v-alert>
                <v-card-text>
                    <v-row dense v-if="PQRSFActual.afiliado">
                        <v-col cols="12" md="12" sm="12">
                            <EditarAfiliadoComponente :afiliado="PQRSFActual.afiliado" :modoDetalle="true"
                                :modoEdicion="true" :mostrarClasificaciones="true" />
                        </v-col>
                        <v-col cols="12" md="12" sm="12" class="my-4">
                            <v-divider></v-divider>
                        </v-col>
                    </v-row>
                    <v-row dense>
                        <v-col cols="12" md="6" sm="6">
                            <v-text-field dense outlined label="Nombre" v-model="PQRSFActual.nombre_genera" readonly
                                v-if="PQRSFActual.quien_genera === 'Otro'"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6" sm="6">
                            <v-text-field dense outlined label="N° Documento" v-model="PQRSFActual.documento_genera"
                                readonly v-if="PQRSFActual.quien_genera === 'Otro'"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6" sm="6">
                            <v-text-field dense outlined label="Correo Electrónico" v-model="PQRSFActual.correo"
                                readonly></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6" sm="6">
                            <v-text-field dense outlined label="Teléfono o Celular" v-model="PQRSFActual.telefono"
                                readonly></v-text-field>
                        </v-col>
                        <v-col cols="12" md="12" sm="12">
                            <v-textarea dense outlined readonly label="Descripción del caso"
                                v-model="PQRSFActual.descripcion" auto-grow></v-textarea>
                        </v-col>
                        <v-col cols="12" md="12" sm="12" class="mb-4">
                            <v-divider></v-divider>
                        </v-col>
                        <v-col cols="12" md="3" sm="3">
                            <v-text-field dense outlined label="Tipo de Requerimiento" :value="PQRSFActual.solicitud
                                ? PQRSFActual.solicitud.Solicitud_nombre
                                : '-'
                                " readonly></v-text-field>
                        </v-col>
                        <v-col cols="12" md="3" sm="3">
                            <v-text-field dense outlined label="Priorización" :value="PQRSFActual.priorizacion ? PQRSFActual.priorizacion : '-'
                                " readonly></v-text-field>
                        </v-col>
                        <v-col cols="12" md="3" sm="3">
                            <v-text-field dense outlined label="Atributo de Calidad" :value="PQRSFActual.atributo_calidad
                                ? PQRSFActual.atributo_calidad
                                : '-'
                                " readonly></v-text-field>
                        </v-col>
                        <v-col cols="12" md="2" sm="3">
                            <v-text-field dense outlined label="Código SuperSalud" readonly :value="PQRSFActual.codigo_super ? PQRSFActual.codigo_super : '-'
                                "></v-text-field>
                        </v-col>
                        <v-col cols="12" md="1" sm="3">
                            <v-text-field dense outlined readonly label="¿Reabierta?"
                                :value="PQRSFActual.reabierta ? 'Si' : 'No'"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="12" sm="12" class="my-4">
                            <v-divider></v-divider>
                        </v-col>
                    </v-row>
                    <v-row dense v-if="
                        PQRSFActual.subcategoria_pqrsf &&
                        PQRSFActual.subcategoria_pqrsf.length > 0
                    ">
                        <v-col cols="12" md="12" sm="12" style="display: flex; justify-content: center">
                            <v-subheader class="text-h6">Subcategoría(s)</v-subheader>
                        </v-col>
                        <v-col cols="12" md="12" sm="12" style="
                display: flex;
                flex-wrap: wrap;
                gap: 0.5rem;
                justify-content: center;
              ">
                            <v-chip small dark color="blue-grey" v-for="item in PQRSFActual.subcategoria_pqrsf"
                                :key="item.id">
                                {{ item.nombre }}
                            </v-chip>
                        </v-col>
                        <v-col cols="12" md="12" sm="12" v-if="
                            PQRSFActual.tipo_solicitud_id === 2 ||
                            PQRSFActual.tipo_solicitud_id === 3
                        " class="mt-4">
                            <v-alert text dense border="left" type="info" v-for="item in derechosSubcategorias"
                                :key="item.id">
                                {{ item.descripcion }}</v-alert>
                        </v-col>
                        <v-col cols="12" md="12" sm="12">
                            <v-divider></v-divider>
                        </v-col>
                    </v-row>
                    <v-row dense v-if="
                        PQRSFActual.codesumi_pqrsf &&
                        PQRSFActual.codesumi_pqrsf.length > 0
                    ">
                        <v-col cols="12" md="12" sm="12" style="display: flex; justify-content: center">
                            <v-subheader class="text-h6">Medicamento(s)</v-subheader>
                        </v-col>
                        <v-col cols="12" md="12" sm="12" style="
                display: flex;
                flex-wrap: wrap;
                gap: 0.5rem;
                justify-content: center;
              ">
                            <v-chip small dark color="blue-grey" v-for="item in PQRSFActual.codesumi_pqrsf"
                                :key="item.id">
                                {{ item.nombre }}
                            </v-chip>
                        </v-col>
                        <v-col cols="12" md="12" sm="12" class="mt-4">
                            <v-divider></v-divider>
                        </v-col>
                    </v-row>
                    <v-row dense v-if="
                        PQRSFActual.servicio_pqrsf &&
                        PQRSFActual.servicio_pqrsf.length > 0
                    ">
                        <v-col cols="12" md="12" sm="12" style="display: flex; justify-content: center">
                            <v-subheader class="text-h6">Servicio(s)</v-subheader>
                        </v-col>
                        <v-col cols="12" md="12" sm="12" style="
                display: flex;
                flex-wrap: wrap;
                gap: 0.5rem;
                justify-content: center;
              ">
                            <v-chip small dark color="blue-grey" v-for="item in PQRSFActual.servicio_pqrsf"
                                :key="item.id">
                                {{ item.nombre }}
                            </v-chip>
                        </v-col>
                        <v-col cols="12" md="12" sm="12" class="mt-4">
                            <v-divider></v-divider>
                        </v-col>
                    </v-row>
                    <v-row dense v-if="PQRSFActual.area_pqrsf && PQRSFActual.area_pqrsf.length > 0">
                        <v-col cols="12" md="12" sm="12" style="display: flex; justify-content: center">
                            <v-subheader class="text-h6">Área(s)</v-subheader>
                        </v-col>
                        <v-col cols="12" md="12" sm="12" style="
                display: flex;
                flex-wrap: wrap;
                gap: 0.5rem;
                justify-content: center;
              ">
                            <v-chip small dark color="blue-grey" v-for="item in PQRSFActual.area_pqrsf" :key="item.id">
                                {{ item.nombre }}
                            </v-chip>
                        </v-col>
                        <v-col cols="12" md="12" sm="12" class="mt-4">
                            <v-divider></v-divider>
                        </v-col>
                    </v-row>
                    <v-row dense v-if="PQRSFActual.ips_pqrsf && PQRSFActual.ips_pqrsf.length > 0">
                        <v-col cols="12" md="12" sm="12" style="display: flex; justify-content: center">
                            <v-subheader class="text-h6">IPS(s) Afectada(s)</v-subheader>
                        </v-col>
                        <v-col cols="12" md="12" sm="12" style="
                display: flex;
                flex-wrap: wrap;
                gap: 0.5rem;
                justify-content: center;
              ">
                            <v-chip small dark color="blue-grey" v-for="item in PQRSFActual.ips_pqrsf" :key="item.id">
                                {{ item.nombre }}
                            </v-chip>
                        </v-col>
                        <v-col cols="12" md="12" sm="12" class="mt-4">
                            <v-divider></v-divider>
                        </v-col>
                    </v-row>
                    <v-row dense v-if="
                        PQRSFActual.codigo_propio_pqrsf &&
                        PQRSFActual.codigo_propio_pqrsf.length > 0
                    ">
                        <v-col cols="12" md="12" sm="12" style="display: flex; justify-content: center">
                            <v-subheader class="text-h6">Código(s) Propio(s)</v-subheader>
                        </v-col>
                        <v-col cols="12" md="12" sm="12" style="
                display: flex;
                flex-wrap: wrap;
                gap: 0.5rem;
                justify-content: center;
              ">
                            <v-chip small dark color="blue-grey" v-for="item in PQRSFActual.codigo_propio_pqrsf"
                                :key="item.id">
                                {{ item.nombre }}
                            </v-chip>
                        </v-col>
                        <v-col cols="12" md="12" sm="12" class="mt-4">
                            <v-divider></v-divider>
                        </v-col>
                    </v-row>
                    <v-row dense v-if="
                        PQRSFActual.operador_pqrsf &&
                        PQRSFActual.operador_pqrsf.length > 0
                    ">
                        <v-col cols="12" md="12" sm="12" style="display: flex; justify-content: center">
                            <v-subheader class="text-h6">Empleado(s)</v-subheader>
                        </v-col>
                        <v-col cols="12" md="12" sm="12" style="
                display: flex;
                flex-wrap: wrap;
                gap: 0.5rem;
                justify-content: center;
              ">
                            <v-chip small dark color="blue-grey" v-for="item in PQRSFActual.operador_pqrsf"
                                :key="item.id">
                                {{
                                    [
                                        item.nombre,
                                        item.apellido,
                                    ].filter(Boolean).join(' ')
                                }}
                            </v-chip>

                        </v-col>
                        <v-col cols="12" md="12" sm="12" class="mt-4">
                            <v-divider></v-divider>
                        </v-col>
                    </v-row>
                    <v-row dense v-if="PQRSFActual.gestion_pqr && PQRSFActual.gestion_pqr.length > 0" class="my-4">
                        <v-col cols="12" md="12" sm="12">
                            <v-alert text dense border="left" color="info" icon="mdi-timeline-clock-outline"
                                class="text-center">
                                <b>Histórico de la PQRF</b>
                            </v-alert>
                        </v-col>
                        <v-col cols="12" md="12" sm="12" v-for="gestion in PQRSFActual.gestion_pqr" :key="gestion.id"
                            style="
                display: flex;
                flex-direction: column;
                flex-wrap: wrap;
                gap: 0.5rem;
                justify-content: center;
              "
            >
              <div style="display: flex; flex-wrap: wrap; gap: 1rem">
                <div style="flex-basis: 15rem; min-width: 15rem">
                  <b>Usuario</b>
                  <br />
                  <span>
                    {{
                      gestion?.user?.tipo_usuario_id === 2
                        ? "Afiliado"
                        : gestion?.user?.operador?.nombre_completo
                    }}
                  </span>
                </div>
                <div style="flex-basis: 25rem; min-width: 25rem">
                  <b>Área</b>
                  <br />
                  <span>
                    {{
                      gestion?.area_responsable
                        ? gestion?.area_responsable?.nombre
                        : "-"
                    }}
                  </span>
                </div>
                <div style="flex-basis: 15rem; min-width: 15rem">
                  <b>Fecha</b>
                  <br />
                  <span>{{ $moment(gestion?.created_at).format('YYYY-MM-D H:mm') }}</span>
                </div>
                <div style="flex-basis: 15rem; min-width: 15rem">
                  <b>Tipo | <i>{{ gestion?.tipo?.nombre }}</i></b>
                  <br />
                  <span>{{ gestion?.tipo?.descripcion }}</span>
                </div>
              </div>
              <div>
                <b>Descripción</b>
                <br />
                <span style="white-space: pre-wrap; text-align: justify;">{{ gestion?.motivo }}</span>
              </div>
              <div>
                <b>Adjuntos</b>
                <br />
                <div
                  style="
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                    justify-content: center;
                  ">
                                    <v-btn small dark color="blue-grey" v-for="adjunto in gestion.adjuntos"
                                        :key="adjunto.id" @click="consultarAdjunto(adjunto.ruta)">
                                        {{ adjunto.nombre }}
                                    </v-btn>
                                    <span v-if="gestion.adjuntos.length === 0">Sin adjuntos para mostrar</span>
                                </div>
                            </div>
                            <v-divider class="my-2"></v-divider>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" small dark @click="cerrarModal">Cerrar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
import { mapActions } from "vuex";
import EditarAfiliadoComponente from "@/components/afiliado/FormularioAfiliadoComponente.vue";

export default {
    components: {
        EditarAfiliadoComponente,
    },
    props: {
        mostrarModalSolucionados: {
            type: Boolean,
            default: false,
        },
        PQRSFSeleccionada: {
            type: Object,
            default: () => { },
        },
    },
    data() {
        return {
            PQRSFActual: {},
            derechosSubcategorias: [],
        };
    },
    watch: {
        mostrarModalSolucionados(newValue) {
            if (newValue) {
                this.buscarPQRSF();
            }
        },
    },
    methods: {
        ...mapActions("app", ["setPreload"]),

        cerrarModal() {
            this.PQRSFActual = {};
            this.$emit("update:mostrarModalSolucionados", false);
        },

        buscarPQRSF() {
            this.setPreload(true);

            this.$axios
                .post("/formularios-pqrsf/listarAsignadosInternaDetalle", {
                    pqr_id: this.PQRSFSeleccionada.id,
                })
                .then((res) => {
                    this.PQRSFActual = res.data;
                    this.listarDerechosSubcategorias();
                })
                .catch((error) => {
                    this.$toast.error("Error al cargar la información de la PQRF");
                })
                .finally(() => {
                    this.setPreload(false);
                });
        },

        listarDerechosSubcategorias() {
            const subcategoriaIds = this.PQRSFActual.subcategoria_pqrsf.map(
                (sub) => sub.id
            );

            this.setPreload(true);
            this.$axios
                .post("/subcategorias/listarDerechosSubcategorias", {
                    subcategorias: subcategoriaIds,
                })
                .then((res) => {
                    this.derechosSubcategorias = res.data;
                })
                .catch((e) => {
                    this.$toast.error("Error al cargar los derechos de la PQRF");
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
                this.$toast.error("Error al cargar el archivo");
            } finally {
                this.setPreload(false);
            }
        },
    },
};
</script>
