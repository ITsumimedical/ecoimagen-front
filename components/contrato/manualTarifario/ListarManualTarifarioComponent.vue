<template>
  <div>
    <!-- Preload -->
    <template>
      <div class="text-center">
        <v-dialog v-model="preload" persistent width="300">
          <v-card color="primary" dark>
            <v-card-text>
              Tranquilo procesamos tu solicitud !
              <v-progress-linear
                indeterminate
                color="white"
                class="mb-0"
              ></v-progress-linear>
            </v-card-text>
          </v-card>
        </v-dialog>
      </div>
    </template>

    <v-card class="mx-100">
      <div>
        <v-toolbar flat>
          <v-spacer></v-spacer>
          <v-btn
            v-if="$can('contratos.modalidadContrato.crear')"
            color="success"
            class="white--text ma-2 px-6"
            small
            @click="dialogs.form = true"
            >Crear<v-icon>mdi-plus</v-icon></v-btn
          >
        </v-toolbar>
      </div>

      <v-divider class="mt-2"></v-divider>

      <v-data-table
        :headers="headers"
        hide-default-footer
        dense
        :items="manuales_tarifarios"
        :loading="loading"
        loading-text="cargando..."
        class="elevation-1 mt-4"
        no-data-text="Sin datos para mostrar"
      >
        <template v-slot:item.activo="{ item }">
          <v-chip small dark :color="item.activo ? 'success' : 'error'">{{
            item.activo ? "Activo" : "Inactivo"
          }}</v-chip>
        </template>

        <template v-slot:item.acciones="{ item }">
          <v-tooltip top v-if="$can('contratos.modalidadContrato.actualizar')">
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                color="warning"
                small
                v-bind="attrs"
                v-on="on"
                @click="editarItem(item)"
              >
                mdi-grease-pencil
              </v-icon>
            </template>
            <span>Editar</span>
          </v-tooltip>

          <v-tooltip top v-if="$can('contratos.modalidadContrato.actualizar')">
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                :color="item.activo ? 'error' : 'success'"
                small
                v-bind="attrs"
                v-on="on"
                @click="cambiarEstadoItem(item)"
              >
                mdi-account-convert
              </v-icon>
            </template>
            <span>{{ item.activo ? "Inactivar" : "Activar" }}</span>
          </v-tooltip>
        </template>
      </v-data-table>

      <v-dialog persistent v-model="dialogs.form" max-width="500px">
        <FormTipoManualComponent
          :editar="editando"
          :manual_tarifario_id="manual_tarifario_id"
          @cerrar="
            (dialogs.form = false),
              (editando = false),
              (manual_tarifario_id = null)
          "
          @submit="getManualesTarifarios()"
        />
      </v-dialog>
    </v-card>
  </div>
</template>

<script>
import FormTipoManualComponent from "~/components/contrato/manualTarifario/FormManualTarifarioComponent.vue";
export default {
  middleware({ $can, redirect }) {
    if (!$can("contratos.modalidadContrato.listar")) {
      return redirect("/");
    }
  },
  components: {
    FormTipoManualComponent,
  },
  name: "ListarTipoManualComponent",

  data() {
    return {
      editando: false,
      manual_tarifario_id: null,
      headers: [
        { text: "ID", value: "id" },
        { text: "Nombre", value: "nombre" },
        { text: "Descripción", value: "descripcion" },
        { text: "Estado", value: "activo" },
      ],
      manuales_tarifarios: [],
      buscar: null,
      loading: false,
      preload: false,
      dialogs: {
        form: false,
      },
    };
  },

  mounted() {
    this.getManualesTarifarios();
  },

  methods: {
    getManualesTarifarios() {
        this.preload = true;
        this.$axios.get("/manual-tarifario/").then(res =>{
          this.manuales_tarifarios = res.data;
          this.preload = false;
        }).catch (error =>{
        this.preload = false;
        this.$toast.error("Error al cargar los datos");
      });
    },

    cambiarEstadoItem(item) {
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
          try {
            this.preload = true;
            this.$axios.put("/manual-tarifario/cambiar-estado/" + item.id);
            this.preload = false;
            this.$toast.success("El manual cambio de estado correctamente");
            this.getManualesTarifarios();
          } catch (error) {
            this.preload = false;
            this.$toast.error("Error al cambiar el estado");
          }
        }
      });
    },

    editarItem(item) {
      this.editando = true;
      this.manual_tarifario_id = item.id;
      this.dialogs.form = true;
    },
  },
};
</script>
