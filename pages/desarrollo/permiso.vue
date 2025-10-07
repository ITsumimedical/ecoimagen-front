<template>
  <div>
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
    <v-dialog v-model="dialog" max-width="500px">
      <v-container fluid class="pa-0">
        <v-card>
          <v-card-title class="titulo black--text">
            <span>{{titulo}}</span>
          </v-card-title>
          <form @submit.prevent="guardarPermisos">
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="12" md="12">
                    <v-text-field dense v-model="permiso.name" label="Nombre" :error-messages="errors.name">
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" sm="12" md="12">
                    <v-text-field dense v-model="permiso.descripcion" label="Descripcion"
                                  :error-messages="errors.descripcion">
                    </v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="error" @click="limpiar()">
                Cancelar
              </v-btn>
              <v-btn color="boton" dark @click="guardarPermisos()">
                Guardar
              </v-btn>
            </v-card-actions>
          </form>
        </v-card>
      </v-container>
    </v-dialog>


    <v-card class="mx-100">
      <div>
        <v-toolbar flat>
          <v-spacer></v-spacer>
          <v-btn color="success" class="white--text ma-2 px-6" small @click="dialog = true">Crear<v-icon>mdi-plus</v-icon></v-btn>
        </v-toolbar>

        <v-row class="mx-2">
          <v-col md="5" lg="5" xl="5" sm="6" cols>
            <v-text-field dense v-model="filtro.nombre" label="Nombre permiso" @keyup.enter="permisos()"  single-line>
            </v-text-field>
          </v-col>

          <v-col md="2" lg="2" xl="2" sm="6" cols>
            <v-btn-toggle background-color="white" dark>
              <v-btn small color="success" @click="permisos()">Filtrar</v-btn>
              <v-btn small class="ml-2" color="error" @click="limpiar()">Limpiar</v-btn>
            </v-btn-toggle>
          </v-col>
        </v-row>
      </div>
      <v-divider class="mt-2"></v-divider>

      <v-data-table :headers="headers" dense :items="permisosList" class="elevation-1 mt-4" hide-default-footer disable-pagination no-data-text="Sin datos para mostrar">
        <template v-slot:[`item.actions`]="{ item }">
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="warning" small class="mr-2" v-bind="attrs" v-on="on" @click="editar(item)">
                mdi-pencil
              </v-icon>
            </template>
            <span>Editar</span>
          </v-tooltip>
        </template>
      </v-data-table>
      <v-row no-gutters>
        <v-col md="9" lg="9" xl="11" sm="11" class="px-2">
          <v-pagination v-model="pagina" class="my-4" :length="total" :total-visible="9" @input="permisos"
          ></v-pagination>
        </v-col>
        <v-col md="3" lg="3" xl="1" sm="1" class="px-2" cols style="min-width: 100px">
          <v-select class="my-4" v-model="opcionActual" :items="opciones" dense solo small @change="permisos"></v-select>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>
<script>
import {guardarPermisos,actualizarPermisos} from '@/api/permisos/permisos'
export default {
  middleware({
               $can,
               redirect
             }) {
    if (!$can('permisos.vista')) {
      return redirect('/');
    }
  },
  name: 'permisos',
  mounted() {
    this.permisos();
  },
  computed: {
    titulo() {
      return this.editedIndex === -1 ? 'Crear permiso' : 'Editar permiso'
    },
  },
  data() {
    return {
      preload:false,
      dialog:false,
      editedIndex: -1,
      pagina:1,
      total:0,
      permisosList:[],
      opciones:[5, 10, 20, 50, 100],
      opcionActual:5,
      filtro:{
        nombre:null
      },
      permiso: {
        id: null,
        name: null,
        descripcion: null
      },
      errors: {
        name: '',
        descripcion: ''
      },
      headers: [{
        text: 'id',
        sortable: false,
        value: 'id',
      },
        {
          text: 'Nombre',
          value: 'name'
        },
        {
          text: 'Descripción',
          value: 'descripcion'
        },
        {
          text: 'Acciones',
          value: 'actions',
          sortable: false
        },
      ],
    };
  },
  methods:{
    permisos(){
      this.preload = true;
      this.$axios.post('/permisos/listar?page='+this.pagina+'&cant='+this.opcionActual,this.filtro).then(res => {
        this.permisosList = res.data.data.data;
        this.total = res.data.data.last_page;
        this.preload = false;
      }).catch(e => {
        this.preload = false;
      })
    },
    limpiar(){
      this.preload = true;
      for (const prop of Object.getOwnPropertyNames(this.filtro)) {
        this.filtro[prop] = null;
      }
      for (const key in this.permiso) {
        this.permiso[key] = ''
      }
      this.editedIndex = -1
      this.dialog = false
      this.preload = false;
      this.permisos();
    },
    ErrorEntrada(errors) {
      for (const key in this.errors) {
        if (key in errors) {
          this.errors[key] = errors[key].join(',')
        }
      }
    },

    async guardarPermisos() {
      this.preload = true;
      this.limpiarError()
      if (this.editedIndex > -1) {
        try {
          const {
            data
          } = await this.$loadingPutRequest(actualizarPermisos(this.permiso.id), this.permiso)
          this.preload = false;
          this.$toast.success(data.mensaje)
          this.permisos()
          this.limpiar()
        } catch (error) {
          this.preload = false;
          if (error.response.data.mensaje) {
            this.$toast.error(error.response.data.mensaje)
          } else if (error.response.data) {
            this.ErrorEntrada(error.response.data)
          }
        }
      } else {
        try {
          const {
            data
          } = await this.$loadingPostRequest(guardarPermisos(), this.permiso)
          this.preload = false;
          this.$toast.success(data.mensaje)
          // this.permisos()
          this.limpiar()
        } catch (error) {
          this.preload = false;
          if (error.response.data.mensaje) {
            this.$toast.error(error.response.data.mensaje)
          } else if (error.response.data) {
            this.ErrorEntrada(error.response.data)
          }
        }
      }
    },
  limpiarError() {
    for (const key in this.errors) {
      this.errors[key] = ''
    }
  },
    editar(item) {
      this.editedIndex = this.permisosList.indexOf(item)
      this.permiso = Object.assign({}, item)
      this.dialog = true
    },

  }
}
</script>
