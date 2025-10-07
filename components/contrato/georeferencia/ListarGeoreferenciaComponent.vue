<template>
  <div>
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

    <v-card>
      <div>
        <v-card-title>
          <v-row dense>
            <v-col cols="12" sm="10" md="10">
              <v-spacer></v-spacer>
              <v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar" single-line
                hide-details></v-text-field>
            </v-col>

            <v-col cols="12" sm="2" md="2">

              <v-btn v-if="$can('contrato.georreferencia.crear')" color="success" class="white--text ma-2 px-6" small
                @click="dialogs.form = true">Crear<v-icon>mdi-plus
                </v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-title>
      </div>


      <v-data-table :headers="headers" :search="search" dense :items="georeferencia" :loading="loading"
        loading-text="cargando..." class="elevation-1 mt-4" no-data-text="Sin datos para mostrar">

        <template v-slot:[`item.acciones`]="{ item }">
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-icon small color="warning" class="mr-2" v-bind="attrs" v-on="on" @click="editarGeorreferencia(item)"
                v-if="$can('contrato.georreferencia.editar')">
                mdi-pencil
              </v-icon>
            </template>
            <span>Editar</span>
          </v-tooltip>
        </template>

      </v-data-table>
      <v-dialog persistent v-model="dialogs.form" max-width="500px">
        <FormGeoreferenciacionComponent @cerrar="dialogs.form = false; getGeoreferenciacion()" />
      </v-dialog>

      <v-dialog persistent v-model="modalEditar" max-width="500px">
      <EditarGeorreferenciacionComponent :georeferenciaSeleccionada="georeferenciaSeleccionada" @cerrar="cerrarModal"  @recargarDatos="getGeoreferenciacion"/>
    </v-dialog>

    </v-card>
  </div>
</template>

<script>
import {
  listarDepartamento
} from "@/api/departamentos/departamento";


import EditarGeorreferenciacionComponent from "./EditarGeorreferenciacionComponent.vue";
import FormGeoreferenciacionComponent from "~/components/contrato/georeferencia/FormGeoreferenciacionComponent.vue";
export default {
  middleware({
    $can,
    redirect
  }) {
    if (!$can("contrato.georreferencia.listar")) {
      return redirect("/");
    }
  },
  components: {
    FormGeoreferenciacionComponent,
    EditarGeorreferenciacionComponent,
  },
  name: "ListarGeoreferenciacionComponent",

  data() {
    return {
      headers: [{
        text: "ID",
        value: "geo_id"
      },
      {
        text: "Zona",
        value: "zonas"
      },
      {
        text: "Entidad",
        value: "entidad"
      },
      {
        text: "Departamento",
        value: "departamento"
      },
      {
        text: "Municipio",
        value: "municipio"
      },
      {
        text: "Acciones",
        value: "acciones",
        align: "center",
        sortable: false,
      },

      ],
      georeferencia: [],
      opciones: [5, 10, 15, 20, 50, 100],
      opcionActual: 15,
      pagina: 1,
      search: null,
      total: 0,
      buscar: null,
      loading: false,
      preload: false,
      dialogs: {
        form: false,
      },
      modalEditar: false,
      georeferenciaSeleccionada: {},
      entidades: [],
      municipios: [],
      departamentos: [],
      filtro: {
        zona_id: null,
        departamento_id: null,
        entidad_id: null,
        municipio_id: null,
      },
    };
  },

  mounted() {
    this.getGeoreferenciacion();
    this.listarEntidades();
    this.listarDepartamentos();
  },

  methods: {
    getGeoreferenciacion() {
      if (this.filtro.departamento_id != null && this.filtro.municipio_id == null) {
        return this.$toast.error("Debe escoger un municipio");
      }
      this.preload = true;
      this.$axios.post("/georreferencia/listar").then(
        res => {
          this.georeferencia = res.data;
          this.preload = false;
        }).catch(error => {
          this.preload = false;
          this.$toast.error("Error al cargar los datos");
        });
    },

    /**
     * listar entidades
     * @return objeto entidades
     * @author kobatime
     */
    listarEntidades() {
      this.$axios.get("/entidad/listar").then((res) => {
        this.entidades = res.data;
      }).catch((error) => {
        console.log(error);
      });
    },

    /**
     * listar departamentos
     * @return departamento objeto
     * @author kobatime
     */
    async listarDepartamentos() {
      try {
        const {
          data
        } = await this.$loadingGetRequest(listarDepartamento());
        this.departamentos = data;
      } catch (error) {
        console.log(error);
      }
    },

    /**
     * listar municipio con filer de departamento
     * @param data number
     * @return municipio objeto
     * @author kobatime
     */
    listarMunicipios(data) {
      return this.departamentos
        .filter((item) => item.id == data)
        .map((municipios) => {
          return (this.municipios = municipios.municipios);
        });
    },

    limpiar() {
      this.preload = true;
      for (const prop of Object.getOwnPropertyNames(this.filtro)) {
        this.filtro[prop] = null;
      }
      this.preload = false;
      this.getGeoreferenciacion();
    },

    editarGeorreferencia(item){
      this.modalEditar = true;
      this.georeferenciaSeleccionada = item;
    },

    cerrarModal(){
      this.modalEditar = false;
    }


  },
};

</script>
