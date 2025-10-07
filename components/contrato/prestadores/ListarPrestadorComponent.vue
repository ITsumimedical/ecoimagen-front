<template>

  <div>
    <!-- tabla prestadores -->
    <v-data-table
      :headers="headers"
      :items="prestadores"
      :search="buscar"
      :loading="loading"
      no-data-text="Sin datos para mostrar"
      loading-text="cargando..."
      class="elevation-1"
      hide-default-footer
      dense
    >
      <!-- encabezado -->
      <template v-slot:top>
        <v-card-title>
          <v-toolbar flat>
            <v-spacer></v-spacer>
            <!-- boton para abrir modal crear -->
            <v-btn
              color="success"
              class="white--text ma-2 px-6"
              small
              @click="dialogs.form = true"
              v-if="$can('prestador.crear')"
            >Crear
              <v-icon>mdi-plus</v-icon>
            </v-btn
            >
          </v-toolbar>

          <!-- dialogo para editar y crear -->
          <v-dialog persistent v-model="dialogs.form" max-width="800px">
            <!-- componente de formulario crear y editar -->
            <FormPrestadorComponent
              :editar="editando"
              :prestador_id="prestador_id"
              @cerrar="dialogs.form = false,editando = false,prestador_id = null"
              @submit="getPrestadores()"
            />
          </v-dialog>
        </v-card-title>

        <!-- filtros para la busqueda -->
        <v-row class="mx-2">
          <v-col cols="12" sm="6" md="4">
            <v-text-field
              dense
              v-model="filtro.nombre"
              label="Nombre prestador"
              outlined
              single-line
            >
            </v-text-field>
          </v-col>

          <v-col cols="12" sm="6" md="3">
            <v-text-field dense v-model="filtro.nit" label="Nit" outlined single-line>
            </v-text-field>
          </v-col>

          <v-col cols="12" sm="6" md="3">
            <v-text-field
              dense
              v-model="filtro.codigo_habilitacion"
              label="Código prestador"
              outlined
              single-line
            >
            </v-text-field>
          </v-col>

          <v-col md="2" lg="2" xl="2" sm="6" cols>
            <v-btn-toggle background-color="white" dark>
              <!-- boton para filtrar -->
              <v-btn v-if="$can('prestador.listar')" small color="success" @click="getPrestadores()"
              >Filtrar
              </v-btn
              >
              <!-- boton limpiar filtro -->
              <v-btn small class="ml-2" color="error" @click="limpiarFiltro()"
              >Limpiar
              </v-btn
              >
            </v-btn-toggle>
          </v-col>
        </v-row>
      </template>

      <!-- accion de colocar un chip segun el estado en el campo de la tabla activo -->
      <template v-slot:[`item.activo`]="{ item }">
        <v-chip small dark :color="item.activo ? 'success' : 'error'">{{
            item.activo ? "Activo" : "Inactivo"
          }}
        </v-chip>
      </template>

      <!-- botones de acciones de la tabla -->
      <template v-slot:[`item.acciones`]="{ item }">
        <v-tooltip bottom>
          <!-- boton de editar informacion de la tabla -->
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              small
              color="warning"
              dark
              v-bind="attrs"
              v-on="on"
              @click="editarItem(item)"
              v-if="$can('prestador.actualizar')"
            >
              mdi-pencil
            </v-icon>
          </template>
          <span>Editar</span>
        </v-tooltip>

        <v-tooltip bottom>
          <!-- boton de editar informacion de la tabla -->
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              small
              color="primary"
              dark
              v-bind="attrs"
              v-on="on"
              @click="abrirModalSede(item)"
              v-if="$can('contrato.reps.vista')"
            >
              mdi-home-map-marker
            </v-icon>
          </template>
          <span>Sedes</span>
        </v-tooltip>

        <v-tooltip bottom>
          <!-- boton de editar informacion de la tabla -->
          <template v-slot:activator="{ on, attrs }">
            <v-icon small color="primary" dark v-bind="attrs" v-on="on" @click="abrirModalLogo(item)"
              v-if="$can('contrato.reps.vista') && item.activo == true">
              mdi-image-area
            </v-icon>
          </template>
          <span>Agregar Logo</span>
        </v-tooltip>

        <v-tooltip bottom>
          <!-- boton para cambiar de estado a un prestador -->
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              small
              :color="item.activo ? 'error' : 'success'"
              dark
              v-bind="attrs"
              v-on="on"
              v-if="$can('prestador.actualizar')"
              @click="cambiarEstadoItem(item)"
            >
              mdi-delete-forever
            </v-icon>
          </template>
          <span>{{ item.activo ? "Inactivar" : "Activar" }}</span>
        </v-tooltip>
      </template>
    </v-data-table>

    <!-- dialogo para editar y crear -->
    <v-dialog persistent v-model="dialogs.reps" fullscreen>
        <!-- componente de formulario crear y editar -->
        <listarRepsComponent
          :prestador_id="prestador_id"
          @cerrar="cerrarReps()"
          @submit="getPrestadores()"
        />
    </v-dialog>

    <!-- paginaciones -->
    <v-row no-gutters>
      <v-col md="9" lg="9" xl="11" sm="11" class="px-2">
        <!-- paginacion numerica con accion de pasar pagina -->
        <v-pagination
          v-model="pagina"
          class="my-4"
          :length="total"
          :total-visible="9"
          @input="getPrestadores()"
        ></v-pagination>
      </v-col>

      <v-col
        md="3"
        lg="3"
        xl="1"
        sm="1"
        class="px-2"
        cols
        style="min-width: 100px"
      >
        <!-- paginacion seleccion de cantidad de datos que se pueden mostrar en la tabla -->
        <v-select
          class="my-4"
          v-model="opcionActual"
          :items="opciones"
          dense
          solo
          small
          @change="getPrestadores()"
        ></v-select>
      </v-col>

        <v-dialog v-model="dialogs.logo" persistent max-width="900px">
            <agregarLogoRep @cerrar="cerrarDialogoLogo()" :prestador_id="prestador_id" :nombre_prestador="nombre_prestador"></agregarLogoRep>
        </v-dialog>

    </v-row>
  </div>
</template>

<script>
import FormPrestadorComponent from "@/components/contrato/prestadores/FormPrestadorComponent.vue";
import listarRepsComponent from "~/components/contrato/reps/ListarRepsComponent.vue";
import agregarLogoRep from "@/components/contrato/prestadores/AgregarLogoPrestadorComponente.vue"

export default {
  middleware({$can, redirect}) {
    if (!$can("contrato.prestadores.vista")) {
      return redirect("/");
    }
  },
  name: 'listarPrestadorComponent',
  components: {
    FormPrestadorComponent,
    listarRepsComponent,
    agregarLogoRep
  },
  data() {
    return {
      headers: [
        {
          text: "Nombre",
          value: "nombre_prestador",
		  sortable: false,
		  align: 'center'
        },
        {
          text: "Municipio",
          value: "municipio.nombre",
		  sortable: false,
		  align: 'center'
        },
        {
          text: "Nit",
          value: "nit",
		  sortable: false,
		  align: 'center'
        },
        {
          text: "Direccion",
          value: "direccion",
		  sortable: false,
		  align: 'center'
        },
        {
          text: "Correo 1",
          value: "correo1",
		  sortable: false,
		  align: 'center'
        },
        {
          text: "Teléfono 1",
          value: "telefono1",
		  sortable: false,
		  align: 'center'
        },
        {
          text: "Código Habilitación",
          value: "codigo_habilitacion",
		  sortable: false,
		  align: 'center'
        },
        {
          text: "Tipo prestador",
          value: "tipo_prestador.nombre",
		  sortable: false,
		  align: 'center'
        },
        {
          text: "Estado",
          value: "activo",
		  sortable: false,
		  align: 'center'
        },
        {
          text: "Acciones",
          value: "acciones",
		  sortable: false,
		  align: 'center'
        },
      ],
      prestadores: [],
      pagina: 1,
      total: 0,
      opciones: [5, 10, 20, 50, 100],
      opcionActual: 10,
      filtro: {
        nombre: null,
        nit: null,
        codigo_habilitacion: null,
      },
      editando: false,
      prestador_id: null,
      buscar: null,
      loading: false,
      nombre_prestador:null,
      dialogs: {
        form: false,
        reps: false,
        logo: false,
      },
    };
  },

  mounted() {
    this.getPrestadores();
  },

  methods: {
    /*
    ! litar prestadores
    * @return object prestadores
    * @author Kobatime
    */
    getPrestadores() {
      this.loading = true;
      this.$axios
        .post(
          "/prestador/listar?page=" +
          this.pagina +
          "&cant=" +
          this.opcionActual,
          this.filtro
        )
        .then((res) => {
          this.prestadores = res.data.data.data;
          this.total = res.data.data.last_page;
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
          this.$toast.error("No se ha podido cargar los datos");
        });
    },

    /*
    ! Cambiar Estado de un prestador
    * @author Kobatime
    */

    cambiarEstadoItem(item) {
      this.$swal({
        title: "Desea cambiarle el estado?",
        text: "Al aceptar este mensaje, se le cambiara el estado tambien a las sedes y los contratos relacionados a este prestador",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#28a745",
        cancelButtonColor: "#d33",
        confirmButtonText: "Aceptar",
      }).then((result) => {
        if (result.value) {
          if (item.activo) {
            item.activo = false;
          } else {
            item.activo = true;
          }
          this.$axios
            .put("/prestador/cambiar-estado/" + item.id, item)
            .then((res) => {
              this.$toast.success(res.data.mensaje);
              this.getManualesTarifarios();
            })
            .catch((error) => {
              this.$toast.error(error.response.mensaje);
            });
        }
      });
    },

    /*
    ! limpiar filtro
    * @return object filtro
    * @author Kobatime
    */
    limpiarFiltro() {
      for (const prop of Object.getOwnPropertyNames(this.filtro)) {
        this.filtro[prop] = null;
      }
      this.getPrestadores();
    },

    /*
    ! abrir modal editando
    * @author Kobatime
    */
    editarItem(item) {
      this.editando = true;
      this.prestador_id = item.id;
      this.dialogs.form = true;
    },

    abrirModalSede(item){
      this.prestador_id = item.id;
      this.dialogs.reps = true;
    },

    cerrarReps(){
      this.dialogs.reps = false;
      this.prestador_id = null;
    },

     abrirModalLogo(item) {
        this.prestador_id = item.id;
        this.nombre_prestador = item.nombre_prestador
        this.dialogs.logo = true;
      },
    cerrarDialogoLogo(){
        this.dialogs.logo = false;
    },
  },
};
</script>
