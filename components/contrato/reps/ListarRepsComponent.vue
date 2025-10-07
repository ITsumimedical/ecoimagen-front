<template>
  <v-card>
    <v-toolbar dark color="primary">
      <v-btn icon dark @click="reps = [],$emit('cerrar')">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-toolbar-title>Sedes de {{prestador.nombre_prestador}} - Nit: {{prestador.nit}} </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <!-- tabla de reps -->

    <v-data-table :headers="headers" :items="reps" class="elevation-1" :loading="loading"
      no-data-text="Sin datos para mostrar" loading-text="cargando..."  :search="buscar" dense>
      <!-- encabezado -->
      <template v-slot:top>
        <v-card-title>

          <v-toolbar flat>
            <v-chip class="ma-3" color="primary" label outlined text-color="black">
              <v-icon left>
                mdi-email </v-icon>
              Correo: {{prestador.correo1}}
            </v-chip>
            <v-chip class="ma-3" color="primary" label outlined text-color="black">
              <v-icon left>
                mdi-cellphone </v-icon>
              Telefono: {{prestador.telefono1}}
            </v-chip>
            <v-chip class="ma-3" color="primary" label outlined text-color="black">
              <v-icon left>
                mdi-hospital-building </v-icon>
              Dirección: {{prestador.direccion}}
            </v-chip>
            <v-spacer></v-spacer>
            <!-- boton para abrir modal crear -->
            <v-btn color="success" class="white--text ma-2 px-6" small @click="dialogs.form = true"
              v-if="$can('rep.crear')">Crear
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-toolbar>

          <v-col cols="12" sm="12" md="12">
            <v-text-field label="Buscar" dense hint="Busca por cualquiera de los campos" v-model="buscar" outlined>
            </v-text-field>
          </v-col>

          <!-- dialogo para editar o crear -->
          <v-dialog persistent v-model="dialogs.form" max-width="1000px">
            <!-- componente que crea o edita -->
            <FormRepsComponent :editar="editando" :rep_id="rep_id" :prestador_id="prestador_id"
              @cerrar="dialogs.form = false,editando = false,rep_id = null" @submit="getReps()" />
          </v-dialog>
          <v-dialog v-model="dialogs.cambiarPrestador" max-width="600px" persistent>
            <cambiarPrestadorRep :rep_id="rep_id" :cerrar="cerrarDialogo" :get-reps="getReps" />
          </v-dialog>

            <v-dialog v-model="dialogs.asignarImagen" max-width="1200px" persistent>
                <asignarImagenComponente ref="asignarImagenRef"  @cerrarDialogoImagen="cerrarDialogoImagen" :rep_id="rep_id" :rep_nombre="rep_nombre" />
          </v-dialog>
        </v-card-title>
        </v-card-title>
      </template>

      <!-- accion de colocar un chip segun el estado en el campo de la tabla activo -->
      <template v-slot:[`item.activo`]="{ item }">
        <v-chip small dark :color="item.activo ? 'success' : 'error'">{{
              item.activo ? "Activo" : "Inactivo"
            }}
        </v-chip>
      </template>

      <!-- botones de acciones de la tabla -->
      <template v-slot:item.acciones="{ item }">
        <v-tooltip bottom>
          <!-- boton de editar informacion de la tabla -->
          <template v-slot:activator="{ on, attrs }">
            <v-icon small class="mr-2" @click="editarItem(item)" v-bind="attrs" v-on="on" color="warning"
              v-if="$can('rep.actualizar')">mdi-pencil
            </v-icon>
          </template>
          <span>Editar</span>
        </v-tooltip>


        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon color="success" dark v-bind="attrs " v-on="on" @click="cambiarPrestadorRep(item)">
              mdi-swap-horizontal
            </v-icon>
          </template>
          <span>Cambiar Prestador</span>
        </v-tooltip>

        <v-tooltip bottom>
          <!-- boton para cambiar de estado a un prestador -->
          <template v-slot:activator="{ on, attrs }">
            <v-icon small @click="cambiarEstado(item)" v-bind="attrs" v-on="on" v-if="$can('rep.actualizar')"
              :color="item.activo ? 'error' : 'success'">mdi-delete-forever
            </v-icon>
          </template>
          <span>{{ item.activo ? "Inactivar" : "Activar" }}</span>
        </v-tooltip>

         <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon color="primary" dark v-bind="attrs" v-on="on" @click="asignarImagenRep(item)">
              mdi-image-area
            </v-icon>
          </template>
          <span>Asignar logo </span>
        </v-tooltip>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
  import FormRepsComponent from "@/components/contrato/reps/FormRepsComponent.vue";
  import cambiarPrestadorRep from "@/components/contrato/reps/cambiarPrestadorComponent.vue";
  import asignarImagenComponente from "@/components/contrato/reps/asignarLogoRepComponente.vue";
  export default {

    middleware({
      $can,
      redirect
    }) {
      if (!$can("contrato.reps.vista")) {
        return redirect("/");
      }
    },

    name: 'listarRepsComponent',

    components: {
      FormRepsComponent,
      cambiarPrestadorRep,
      asignarImagenComponente
    },

    props: {
      prestador_id: Number
    },

    watch: {
      prestador_id() {
        this.getReps();
      },
    },

    data() {
      return {
        headers: [{
            text: "Codigo de habilitación",
            value: "codigo_habilitacion_completo",
          },
          {
            text: "Nombre",
            value: "nombre",
          },
          {
            text: "Correo 1",
            value: "correo1",
          },
          {
            text: "Telefono 1",
            value: "telefono1",
          },
          {
            text: "Dirección",
            value: "direccion",
          },
          {
            text: "Municipio",
            value: "municipio.nombre",
          },
          {
            text: "Estado",
            value: "activo",
          },
          {
            text: "Acciones",
            value: "acciones",
          },
        ],
        reps: [],
        municipios: [],
        prestador: [],
        editando: false,
        rep_id: null,
        loading: false,
        buscar: '',
        dialogs: {
          form: false,
          cambiarPrestador: false,
          asignarImagen: false,
        },
        pagina: 1,
        total: 0,
        opciones: [5, 10, 20, 50, 100],
        opcionActual: 10,
        filtro: {
          prestador_id: null,
          municipio_id: null,
        },
      };
    },

    mounted() {
      this.getMunicipios();
      this.getReps();
    },

    methods: {
      getReps() {
        this.prestador = [];
        this.loading = true;
        this.filtro.prestador_id = this.prestador_id;

        this.$axios.post("/reps/listar", this.filtro)
          .then((res) => {
            if (res.data && res.data.length > 0) {
              this.reps = res.data
              this.prestador = res.data[0].prestadores || [];
            } else {
              this.reps = [];
              this.prestador = [];
            }
            this.loading = false;
          })
          .catch((error) => {
            this.loading = false;
            this.$toast.error("No se ha podido cargar los datos");
          });
      },

      cambiarPrestadorRep(item) {
        this.dialogs.cambiarPrestador = true;
        this.rep_id = item.id
      },

      async getMunicipios() {
        try {
          const {
            data
          } = await this.$axios.get("/municipios/listar");
          this.municipios = data;
        } catch (error) {
          this.$toast.error("Problemas al consultar los municipios.");
        }
      },

      async cambiarEstado(item) {
        this.$swal({
          title: "¿Desea cambiar el estado?",
          text: "Al aceptar este mensaje, se le cambiará el estado también a los contratos relacionados a esta sede",
          type: "question",
          showCancelButton: true,
          confirmButtonColor: "#28a745",
          cancelButtonColor: "#d33",
          confirmButtonText: "Aceptar",
          cancelButtonText: "Cancelar",
        }).then((result) => {
          if (result.value) {
            if (item.activo ? item.activo = false : item.activo = true)
              this.$axios
              .put("/reps/cambiar-estado/" + item.id, item)
              .then((res) => {
                this.$toast.success("Se cambio el estado del reps correctamente");
                this.getReps();
              })
              .catch((error) => {
                this.$toast.error("Error al cambiar el estado del reps");
              });
          }
        });
      },

      limpiarFiltro() {
        this.filtro.municipio_id = null;
        this.filtro.nombre_prestador = null;
        this.getReps();
      },

      cerrarDialogo() {
        this.dialogs.cambiarPrestador = false
      },
      async getPrestador() {
        try {
          const response = await this.$axios.post("/prestador/listar");
          this.prestadores = response.data.data;
        } catch (error) {
          this.$toast.error("Problemas al consultar los municipios.");
        }
      },

      editarItem(item) {
        this.editando = true;
        this.rep_id = item.id;
        this.dialogs.form = true;
      },

       asignarImagenRep(item)
    {
        this.dialogs.asignarImagen = true;
        this.rep_id = item.id;
        this.rep_nombre = item.nombre;
        this.$nextTick(() => {
            this.$refs.asignarImagenRef.logoPorRep();
        })
    },

    cerrarDialogoImagen() {
        this.dialogs.asignarImagen = false;
    }
    },
  };

</script>
