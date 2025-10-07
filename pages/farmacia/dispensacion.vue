<template>
  <v-card elevation="0">
    <v-card-title>
      <v-toolbar flat>
        <v-toolbar-title>
          <div class="d-flex align-center">
            <img src="/images/ojo.svg" alt="" height="50px" width="50px" />
            <span>Dispensación</span>
          </div>
        </v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
      </v-toolbar>
    </v-card-title>
    <v-card-text>
      <v-form ref="formBuscarAfiliado">
        <v-row>
          <v-col cols="12" md="5" sm="12">
            <v-autocomplete
              dense
              outlined
              label="Tipo de documento"
              :items="tiposDocumentos"
              :loading="loading.tiposDocumentos"
              no-data-text="No hay resultados"
              item-value="id"
              item-text="nombre"
              v-model="datosBuscarAfiliado.tipo_documento"
              hint="Ingresa el tipo de documento del afiliado"
              :rules="[(v) => !!v || 'Este campo es requerido']"
            />
          </v-col>
          <v-col cols="12" md="5" sm="12">
            <v-text-field
              dense
              outlined
              label="Número de documento"
              @keyup.enter="consultarAfiliado()"
              v-model.trim="datosBuscarAfiliado.numero_documento"
              hint="Ingresa el número de documento del afiliado"
              :rules="[(v) => !!v || 'Este campo es requerido']"
            />
          </v-col>
          <v-col cols="12" md="2" sm="12" style="display: flex; gap: 0.2rem">
            <v-btn
              color="primary"
              dark
              @click="consultarAfiliado()"
              style="min-width: fit-content"
              >Consultar <v-icon right>mdi-magnify</v-icon></v-btn
            >
            <v-btn
              color="red"
              dark
              @click="limpiarAfiliado()"
              style="min-width: fit-content"
              >Limpiar<v-icon right>mdi-close</v-icon></v-btn
            >
          </v-col>
        </v-row>
      </v-form>
      <v-row v-if="afiliado">
        <v-col cols="12" md="12" sm="12">
          <datosAfiliadoDispensacion
            :afiliado="afiliado"
          ></datosAfiliadoDispensacion>
        </v-col>
        <v-col cols="12" md="12" sm="12">
          <v-divider></v-divider>
        </v-col>
        <v-col cols="12" md="12" sm="12">
          <v-alert
            text
            dense
            border="left"
            type="info"
            icon="mdi-store-check"
            class="text-center"
          >
            <b>Seleccionar Farmacia</b>
          </v-alert>
        </v-col>
        <v-col cols="12" md="12" sm="12">
          <v-autocomplete
            dense
            label="Farmacia"
            :items="opcionesFarmacias"
            item-value="id"
            item-text="nombre"
            outlined
            v-model="farmaciaSeleccionada"
            @click="listarBodegasAsociadas()"
            :loading="loading.farmacias"
          ></v-autocomplete>
        </v-col>
        <v-col cols="12" md="12" sm="12" v-if="farmaciaSeleccionada">
          <v-tabs v-model="tab" grow @change="onTabChange">
            <v-tabs-slider color="primary"></v-tabs-slider>
            <v-tab key="medicamentosActivos"> Activos </v-tab>
            <v-tab key="medicamentosPendientes"> Pendientes </v-tab>
            <v-tab key="medicamentosDispensados"> Dispensados </v-tab>
            <v-tab key="medicamentosProximos"> Próximos </v-tab>
            <!-- <v-tab key="medicamentosHorus1"> Activos Horus 1 </v-tab> -->
          </v-tabs>
                    <v-tabs-items v-model="tab">
                        <v-tab-item key="medicamentosActivos">
                            <activosDispensacion ref="activosDispensacion" :afiliadoId="afiliado.id"
                                :farmaciaId="farmaciaSeleccionada" />
                        </v-tab-item>
                        <v-tab-item key="medicamentosPendientes">
                            <pendientesDispensacion ref="pendientesDispensacion" :afiliadoId="afiliado.id"
                                :farmaciaId="farmaciaSeleccionada" />
                        </v-tab-item>
                        <v-tab-item key="medicamentosDispensados">
                            <dispensadosDispensacion ref="dispensadosDispensacion" :afiliadoId="afiliado.id" />
                        </v-tab-item>
                        <v-tab-item key="medicamentosProximos">
                            <proximosDispensacion ref="proximosDispensacion" :afiliadoId="afiliado.id" />
                        </v-tab-item>
                        <!-- <v-tab-item key="medicamentosHorus1">
                            <activosHorusUnoDispensacion ref="activosHorusUnoDispensacion" :afiliado="afiliado" />
                        </v-tab-item> -->
                    </v-tabs-items>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>
<script>
import { mapActions } from "vuex";
import datosAfiliadoDispensacion from "@/components/farmacia/dispensacion/datosAfiliadoDispensacion.vue";
import activosDispensacion from "@/components/farmacia/dispensacion/activosDispensacion.vue";
import pendientesDispensacion from "@/components/farmacia/dispensacion/pendientesDispensacion.vue";
import dispensadosDispensacion from "@/components/farmacia/dispensacion/dispensadosDispensacion.vue";
import proximosDispensacion from "@/components/farmacia/dispensacion/proximosDispensacion.vue";
import activosHorusUnoDispensacion from "@/components/farmacia/dispensacion/activosHorusUnoDispensacion.vue";

export default {
    components: {
        datosAfiliadoDispensacion,
        activosDispensacion,
        pendientesDispensacion,
        dispensadosDispensacion,
        proximosDispensacion,
        activosHorusUnoDispensacion,
    },
    data() {
        return {
            loading: {
                tiposDocumentos: false,
                farmacias: false,
            },
            datosBuscarAfiliado: {
                numero_documento: null,
                tipo_documento: null,
            },
            tiposDocumentos: [],
            afiliado: null,
            opcionesFarmacias: [],
            farmaciaSeleccionada: null,
            tab: "medicamentosActivos",
        };
    },
    mounted() {
        this.listarTiposDocumentos();
        // this.listarFarmacias();
    },
    methods: {
        ...mapActions("app", ["setPreload"]),

        listarTiposDocumentos() {
            this.loading.tiposDocumentos = true;
            this.$axios
                .get("/tipo-documento/listar")
                .then((res) => {
                    this.tiposDocumentos = res.data;
                })
                .catch((error) => {
                    this.$toast.error(
                        "Ocurrió un error al cargar los tipos de documento"
                    );
                    console.log(error);
                })
                .finally(() => {
                    this.loading.tiposDocumentos = false;
                });
        },

        consultarAfiliado() {
            if (!this.$refs.formBuscarAfiliado.validate()) {
                this.$toast.error(
                    "Por favor ingrese el tipo de documento y el número de documento."
                );
                return;
            }

            this.afiliado = null;
            this.setPreload(true);
            this.$axios
                .get(
                    `/afiliados/${this.datosBuscarAfiliado.numero_documento}/${this.datosBuscarAfiliado.tipo_documento}`
                )
                .then((res) => {
                    this.afiliado = res.data;
                })
                .catch((error) => {
                    this.$toast.error(
                        "El afiliado no se encuentra registrado en la base de datos."
                    );
                    console.log(error);
                })
                .finally(() => {
                    this.setPreload(false);
                });
        },

        limpiarAfiliado() {
            this.datosBuscarAfiliado = {
                numero_documento: null,
                tipo_documento: null,
            };
            this.afiliado = null;

            this.$refs.formBuscarAfiliado.resetValidation();
        },

        // listarFarmacias() {
        //     this.loading.farmacias = true;
        //     this.$axios
        //         .get("/bodegas/listarBodegasAsociadas")
        //         .then((res) => {
        //             this.opcionesFarmacias = res.data;
        //         })
        //         .catch((e) => {
        //             this.$toast.error("Ocurrió un error al cargar las farmacias");
        //         })
        //         .finally(() => {
        //             this.loading.farmacias = false;
        //         });
        // },

        listarBodegasAsociadas() {
            this.loading.farmacias = true;
            this.$axios.get('bodegas/listar-bodegas-asociadas-por-entidades/' + this.afiliado.entidad_id).then((res) => {
                this.opcionesFarmacias = res.data;
            }).catch((e) => {
                this.$toast.error("Ocurrió un error al cargar las farmacias");
                console.error(e.response.data.error)
            }).finally(() => {
                this.loading.farmacias = false;
            })
        },

        onTabChange(tab) {
            // `tab` es el índice del tab seleccionado (0, 1, 2...)
            switch (tab) {
                case 0: // Primer tab (Activos)
                    if (this.$refs.activosDispensacion) {
                        this.$refs.activosDispensacion.listarOrdenesActivas();
                    }
                    break;
                case 1: // Segundo tab (Pendientes)
                    if (this.$refs.pendientesDispensacion) {
                        this.$refs.pendientesDispensacion.listarOrdenesPendientes();
                    }
                    break;
                case 2: // Tercer tab (Dispensados)
                    if (this.$refs.dispensadosDispensacion) {
                        this.$refs.dispensadosDispensacion.listarArticulosDispensados();
                    }
                    break;
                case 3: // Cuarto tab (Proximos)
                    if (this.$refs.proximosDispensacion) {
                        this.$refs.proximosDispensacion.listarOrdenesProximas();
                    }
                    break;
                case 4: // Quinto tab (HorusUno)
                    if (this.$refs.activosHorusUnoDispensacion) {
                        this.$refs.activosHorusUnoDispensacion.listarOrdenesHorusUno();
                    }
                    break;
                default:
                    console.log("Tab no encontrado");
                    break;
            }
        },
    },
};
</script>
