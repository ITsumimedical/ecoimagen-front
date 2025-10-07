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

    <v-card class="mx-100">
      <div>
        <v-toolbar flat>
          <v-spacer></v-spacer>
          <v-btn v-if="$can('homologo.actualizacionMasiva')" color="success" class="white--text ma-2 px-6" small
            @click="dialogo = true">Actualizar homologo<v-icon>mdi-upload</v-icon>
          </v-btn>
        </v-toolbar>

        <v-row class="mx-2">
          <v-col md="2" lg="2" xl="2" sm="6" cols>
            <v-autocomplete v-if="$can('homologo.listar')" v-model="form.anio" :items="listanio" label="Año" dense
              outlined></v-autocomplete>
          </v-col>

          <v-col md="4" lg="4" xl="4" sm="6" cols>
            <v-autocomplete v-if="$can('homologo.listar')" v-model="form.manual_id" :items="manuales_tarifarios"
              item-text="nombre" item-value="id" label="Manual" dense outlined></v-autocomplete>
          </v-col>

          <v-col md="4" lg="4" xl="4" sm="6" cols>
            <v-text-field v-if="$can('homologo.listar')" v-model="form.codigo_cups" label="Codigo Cups" dense outlined>
            </v-text-field>
          </v-col>

          <v-col md="2" lg="2" xl="2" sm="6" cols>
            <v-btn-toggle background-color="white" dark>
              <v-btn v-if="$can('homologo.listar')" small color="success" @click="getHomologos()">Filtrar</v-btn>
              <v-btn v-if="$can('homologo.listar')" small class="ml-2" color="error" @click="limpiarFiltro()">Limpiar
              </v-btn>
            </v-btn-toggle>
          </v-col>
        </v-row>
      </div>

      <v-divider class="mt-2"></v-divider>
      <v-data-table :headers="headers" :items="homologos" :search="buscar" :loading="loading" class="elevation-1 mt-4"
        loading-text="cargando..." hide-default-footer disable-pagination no-data-text="Sin datos para mostrar" dense>
        <template v-slot:item.estado="{ item }">
          <v-chip small dark :color="item.estado ? 'success' : 'error'">{{
            item.estado ? "Activo" : "Inactivo"
          }}</v-chip>
        </template>

        <template v-slot:item.uvr="{ item }">
          <span v-if="item.uvr == null"> 0</span>
          <span v-else>{{item.uvr}}</span>
        </template>

        <template v-slot:item.grupo_cx="{ item }">
          <span v-if="item.grupo_cx == null"> No</span>
          <span v-else>{{item.grupo_cx}}</span>
        </template>

        <template v-slot:item.puntaje_grupo_uvt="{ item }">
          <span v-if="item.puntaje_grupo_uvt == null"> No</span>
          <span v-else>{{item.puntaje_grupo_uvt}}</span>
        </template>

        <template v-slot:item.valorPesosUVR="{ item }">
          $ {{ item.valorPesosUVR }}
        </template>

        <template v-slot:item.valorPesosUVT="{ item }">
          $ {{ item.valorPesosUVT }}
        </template>

        <template v-slot:item.valorPesosGrupo="{ item }">
          $ {{ item.valorPesosGrupo }}
        </template>

        <template v-slot:item.valor="{ item }">
          $ {{ item.valorPesos }}
        </template>
      </v-data-table>

      <v-row no-gutters>
        <v-col md="9" lg="9" xl="11" sm="11" class="px-2">
          <v-pagination v-model="pagina" class="my-4" :length="total" :total-visible="9" @input="getHomologos()">
          </v-pagination>
        </v-col>
        <v-col md="3" lg="3" xl="1" sm="1" class="px-2" cols style="min-width: 100px">
          <v-select class="my-4" v-model="opcionActual" :items="opciones" dense solo small @change="getHomologos()">
          </v-select>
        </v-col>
      </v-row>

      <v-dialog v-model="dialogo" persistent max-width="500">
        <v-card :loading="loading">
          <template slot="progress">
            <v-progress-linear color="primary" height="10" indeterminate></v-progress-linear>
          </template>

          <v-card-title class="titulo text--black">
            Subir Homologo
          </v-card-title>

          <v-card-text>
            <v-file-input v-model="file" @change="manejoError" show-size accept=".xlsx" label="Selecccione el archivo">
              <template v-slot:selection="{ text }">
                <v-chip small label color="primary">
                  {{ text }}
                </v-chip>
              </template>
            </v-file-input>

            <v-alert v-if="errorMessage" type="error">{{
              errorMessage
            }}</v-alert>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error" dark small :disabled="loading" @click="(dialogo = false), limpiarFiltro()">
              cerrar
            </v-btn>
            <v-btn color="primary" dark small :disabled="loading" @click="cargarArchivo()">
              Subir
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
  </div>
</template>

<script>
  import FormHomologoComponent from "@/components/contrato/homologo/FormHomologoComponent.vue";
  export default {
    middleware({
      $can,
      redirect
    }) {
      if (!$can("contratos.servicios.homologo")) {
        return redirect("/");
      }
    },
    components: {
      FormHomologoComponent,
    },
    name: "ListarHomogolo",

    data() {
      return {
        loading: false,
        preload: false,
        homologos: [],
        manuales_tarifarios: [],
        form: {
          anio: null,
          manual_id: null,
          codigo_cups: null,
        },
        opciones: [5, 10, 15, 20, 50, 100],
        opcionActual: 15,
        pagina: 1,
        total: 0,
        file: null,
        buscar: null,
        dialogo: false,
        errorMessage: null,
        headers: [{
            text: "Manual",
            value: "tipo_manual.nombre"
          },
          {
            text: "Codigo Cups",
            value: "cup_codigo"
          },
          {
            text: "Descripción Cups",
            value: "descripcion"
          },
          {
            text: "UVR",
            value: "uvr",
            align: "center"
          },
          {
            text: "Valor UVR",
            value: "valorPesosUVR"
          },
          {
            text: "Grupo CX",
            value: "grupo_cx"
          },
          {
            text: "Valor Grupo CX",
            value: "valorPesosGrupo",
            align: "center"
          },
          {
            text: "Grupo/Puntaje UVT",
            value: "puntaje_grupo_uvt"
          },
          {
            text: "Valor UVT",
            value: "valorPesosUVT"
          },
          {
            text: "Valor",
            value: "valor"
          },
          {
            text: "Año",
            value: "anio"
          },
          {
            text: "Estado",
            value: "estado"
          },
        ],
        listanio: [],
      };
    },

    mounted() {
      this.getHomologos();
      this.arrayAnios();
      this.getManualesTarifarios();
    },

    methods: {
      arrayAnios() {
        let n = new Date().getFullYear();
        for (let i = n; i >= 2018; i--) {
          this.listanio.push(i);
        }
      },

      getHomologos() {
        this.preload = true;
        this.$axios.post("/homologo?page=" + this.pagina + "&cant=" + this.opcionActual,
          this.form).then(res => {
          this.homologos = res.data.data.data;
          this.total = res.data.data.last_page;
          this.preload = false;
        }).catch(error => {
          this.loading = false;
          this.$toast.error("No se ha podido cargar los datos");
        });
      },

      async getManualesTarifarios() {
        try {
          const {
            data
          } = await this.$axios.get("/manual-tarifario");
          this.manuales_tarifarios = data;
        } catch (error) {
          this.$toast.error("Error al cargar los datos");
        }
      },

      limpiarFiltro() {
        this.form.anio = null;
        this.form.manual_id = null;
        this.form.codigo_cups = null;
        this.file = null;
        this.getHomologos();
      },

      manejoError() {
        this.errorMessage = "";
      },

      async cargarArchivo() {
        if (!this.file) {
          this.$toast.error("El archivo de carga es requerido");
          return;
        }
        this.loading = true;
        const formData = new FormData();
        formData.append("file", this.file);
        await this.$axios
          .post("/homologo/subirArchivo", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((res) => {
            this.loading = false;
            this.dialogo = false;
            this.$toast.success(res.data.data);
            this.getHomologos();
            this.limpiarFiltro();
          })
          .catch((error) => {
            this.loading = false;
            this.errorMessage = error.response.data.mensaje;
          });
      },
    },
  };

</script>
