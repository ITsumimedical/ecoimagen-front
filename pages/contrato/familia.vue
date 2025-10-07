<template>
  <!-- opciones -->
  <v-tabs centered color="white" icons-and-text>
    <v-tabs-slider color="primary"></v-tabs-slider>

    <v-tab href="#tab-1" class="black--text">
      Familias
      <v-icon color="black">mdi-account-multiple</v-icon>
    </v-tab>

    <v-tab href="#tab-2" class="black--text">
      Tipo Familia
      <v-icon color="black">mdi-account-multiple</v-icon>
    </v-tab>

    <!-- Familia -->
    <v-tab-item :value="'tab-1'">
      <v-card class="mx-100">
        <div>
          <v-toolbar flat>
            <v-spacer></v-spacer>
            <v-btn color="success" class="white--text ma-2 px-6" small @click="dialogs_familia.form = true">Crear
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-toolbar>

          <v-row class="mx-2">
            <v-col md="5" lg="5" xl="5" sm="6" cols>
              <v-text-field dense v-model="filtro.buscar" label="Nombre" outlined>
              </v-text-field>
            </v-col>

            <v-col md="5" lg="5" xl="5" sm="6" cols>
              <v-autocomplete dense :items="tipos_familias" item-text="nombre" item-value="id"
                v-model="filtro.tipo_familia_id" label="Tipo familia" outlined>
              </v-autocomplete>
            </v-col>

            <v-col md="2" lg="2" xl="2" sm="6" cols>
              <v-btn-toggle background-color="white" dark>
                <v-btn small color="success" @click="getFamilias()">Filtrar</v-btn>
                <v-btn small class="ml-2" color="error" @click="limpiarFiltro()">Limpiar</v-btn>
              </v-btn-toggle>
            </v-col>
          </v-row>
        </div>

        <v-divider class="mt-2"></v-divider>
        <v-data-table :headers="headers_familia" :items="familias" class="elevation-1 mt-4" loading-text="cargando..."
          no-data-text="Sin datos para mostrar" dense>
          <template v-slot:item.activo="{ item }">
            <v-chip small dark :color="item.activo ? 'success' : 'error'">{{
              item.activo ? "Activo" : "Inactivo"
              }}
            </v-chip>
          </template>

          <template v-slot:item.gestion="{ item }">
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-icon color="success" small v-bind="attrs" v-on="on" @click="modificarCups(item.id)">
                  mdi-file-plus
                </v-icon>
              </template>
              <span>Agregar Cups</span>
            </v-tooltip>

            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-icon color="warning" small v-bind="attrs" v-on="on" @click="editarItemFamilia(item)">
                  mdi-border-color
                </v-icon>
              </template>
              <span>Editar Familia</span>
            </v-tooltip>

            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-icon :color="item.activo ? 'error' : 'success'" small v-bind="attrs" v-on="on"
                  @click="cambiarEstadoFamiliaItem(item)">
                  {{ item.activo ? "mdi-delete" : "mdi-delete-empty" }}
                </v-icon>
              </template>
              <span>{{ item.activo ? "Inactivar" : "Activar" }} Familia</span>
            </v-tooltip>
          </template>
        </v-data-table>

        <v-dialog persistent v-model="dialogs_familia.form" max-width="500px">
          <FormFamiliaComponent :editar="editando" :familia_id="familia_id" @cerrar="
            (dialogs_familia.form = false),
            (editando = false),
            (tipo_familia_id = null)
            " @submit="getFamilias()" />
        </v-dialog>
        <v-dialog persistent v-model="dialogs_familia.cups" max-width="1500px">
          <AgregarCupsFamiliaComponent :familia_id="familia_id" :editar="editando" @cerrar="cerrarCups()" />
        </v-dialog>

      </v-card>
    </v-tab-item>

    <!-- Tipo Familia -->
    <v-tab-item :value="'tab-2'">
      <v-card class="mx-100">
        <div>
          <v-toolbar flat>
            <v-spacer></v-spacer>
            <v-btn v-if="$can('tipoFamilia.crear')" color="success" class="white--text ma-2 px-6" small
              @click="dialogs_tipo_familia.form = true">Crear
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-toolbar>
        </div>

        <v-data-table :headers="headers_tipo_familia" :items="tipos_familias" class="elevation-1 mt-4"
          loading-text="cargando..." hide-default-footer disable-pagination no-data-text="Sin datos para mostrar" dense>
          <template v-slot:item.activo="{ item }">
            <v-chip small dark :color="item.activo ? 'success' : 'error'">{{
              item.activo ? "Activo" : "Inactivo"
              }}
            </v-chip>
          </template>

          <template v-slot:item.acciones="{ item }">
            <v-tooltip top v-if="$can('tipoFamilia.actualizar')">
              <template v-slot:activator="{ on, attrs }">
                <v-icon color="warning" small v-bind="attrs" v-on="on" @click="editarItemTipoFamilia(item)">
                  mdi-grease-pencil
                </v-icon>
              </template>
              <span>Editar</span>
            </v-tooltip>

            <v-tooltip top v-if="$can('tipoFamilia.actualizar')">
              <template v-slot:activator="{ on, attrs }">
                <v-icon :color="item.activo ? 'error' : 'success'" small v-bind="attrs" v-on="on"
                  @click="cambiarEstadoItem(item)">
                  mdi-account-convert
                </v-icon>
              </template>
              <span>{{ item.activo ? "Inactivar" : "Activar" }}</span>
            </v-tooltip>
          </template>
        </v-data-table>

        <v-dialog persistent v-model="dialogs_tipo_familia.form" max-width="500px">
          <FormTipoFamiliaComponent :editar="editando" :tipo_familia_id="tipo_familia_id" @cerrar="
            (dialogs_tipo_familia.form = false),
            (editando = false),
            (tipo_familia_id = null)
            " @submit="getTiposFamilia()" />
        </v-dialog>
      </v-card>
    </v-tab-item>

    <!-- Preload -->
    <template>
      <div class="text-center">
        <v-dialog v-model="preload" persistent width="300">
          <v-card color="primary" dark>
            <v-card-text>
              Tranquilo procesamos tu solicitud !
              <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
            </v-card-text>
          </v-card>
        </v-dialog>
      </div>
    </template>
  </v-tabs>
</template>

<script>
import FormFamiliaComponent from "@/components/contrato/familias/FormFamiliaComponent.vue";
import AgregarCupsFamiliaComponent from "@/components/contrato/familias/AgregarCupsFamiliaComponent.vue";
import FormTipoFamiliaComponent from "@/components/contrato/tipoFamilias/FormTipoFamiliaComponent.vue";

export default {
  middleware({ $can, redirect }) {
    if (!$can("contrato.familias.vista")) {
      return redirect("/");
    }
  },
  name: "listar-familia",

  components: {
    FormFamiliaComponent,
    AgregarCupsFamiliaComponent,
    FormTipoFamiliaComponent,
  },

  data() {
    return {
      headers_familia: [
        { text: "ID", value: "id" },
        { text: "Nombre", value: "nombre" },
        { text: "Descripcion", value: "descripcion" },
        { text: "Tipo familia", value: "tipo_familia.nombre" },
        { text: "Estado", value: "activo" },
        { text: "Acciones", value: "gestion", sortable: false },
      ],
      familias: [],
      editando: false,
      familia_id: null,
      buscar: null,
      loading: false,
      preload: false,
      dialogs_familia: {
        form: null,
        cups: null,
      },
      filtro: {
        buscar: null,
        tipo_familia_id: null,
      },
      opciones: [5, 10, 15, 20, 50, 100],
      opcionActual: 15,
      pagina: 1,
      total: 0,

      //Tipo Familias
      headers_tipo_familia: [
        { text: "Id", value: "id" },
        { text: "Nombre", value: "nombre" },
        { text: "Descripcion", value: "descripcion" },
        { text: "Estado", value: "activo" },
      ],
      tipos_familias: [],
      tipo_familia_id: null,
      dialogs_tipo_familia: {
        form: null,
      },
    };
  },

  mounted() {
    this.getFamilias();
    this.getTiposFamilia();
  },

  methods: {
    // Funciones Familias
    async getFamilias() {
      try {
        this.preload = true;

        const res = await this.$axios.post('/familia/listar', this.filtro);
        this.familias = res.data.data;

      } catch (error) {
        this.$toas.error('No se ha podido cargar los datos')
      } finally {
        this.preload = false
      }
    },

    async cambiarEstadoFamiliaItem(item) {
      this.$swal({
        title: "Desea cambiarle el estado?",
        text: "Al aceptar este mensaje, se realizara el cambio del estado",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#28a745",
        cancelButtonColor: "#d33",
        confirmButtonText: "Aceptar",
      }).then((result) => {
        if (result.value) {
          this.preload = true;
          this.$axios
            .put("/familia/cambiar-estado/" + item.id)
            .then((res) => {
              this.$toast.success(
                "Se cambio el estado de la familia correctamente"
              );
              this.preload = false;
              this.getFamilias();
            })
            .catch((error) => {
              this.preload = false;
              this.$toast.error(
                "Error al cambiar el estado del la familia"
              );
            });
        }
      });
    },

    editarItemFamilia(item) {
      this.dialogs_familia.form = true;
      this.editando = true;
      this.familia_id = item.id;
    },

    modificarCups(id) {
      this.dialogs_familia.cups = true;
      this.editando = true;
      this.familia_id = id;
    },

    cerrarCups() {
      this.familia_id = null;
      this.editando = false;
      this.dialogs_familia.cups = false;
    },

    limpiarFiltro() {
      this.preload = true;
      for (const prop of Object.getOwnPropertyNames(this.filtro)) {
        this.filtro[prop] = null;
      }
      this.preload = false;
      this.getFamilias();
    },

    //Funciones Tipo Familia
    async getTiposFamilia() {
      try {
        this.preload = true;
        const { data } = await this.$axios.get("/tipo-familia");
        this.tipos_familias = data;
        this.preload = false;
      } catch (error) {
        this.preload = false;
        this.$toast.error("No se ha podido cargar los datos");
      }
    },

    async cambiarEstadoItem(item) {
      this.$swal({
        title: "Desea cambiarle el estado?",
        text: "Al aceptar este mensaje, se realizara el cambio del estado",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#28a745",
        cancelButtonColor: "#d33",
        confirmButtonText: "Aceptar",
      }).then((result) => {
        if (result.value) {
          this.preload = true;
          this.$axios
            .put("/tipo-familia/cambiar-estado/" + item.id)
            .then((res) => {
              this.$toast.success(
                "Se cambio el estado del tipo de familia correctamente"
              );
              this.getTiposFamilia();
              this.preload = false;
            })
            .catch((error) => {
              this.preload = false;
              this.$toast.error(
                "Error al cambiar el estado del tipo de familia"
              );
            });
        }
      });
    },

    editarItemTipoFamilia(item) {
      this.dialogs_tipo_familia.form = true;
      this.editando = true;
      this.tipo_familia_id = item.id;
    },
  },
};
</script>
