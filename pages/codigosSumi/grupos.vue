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

    <v-data-table :headers="headers" :items="grupos" :search="buscar" dense :footer-props="{
      itemsPerPageText: 'Filas por página:'
    }">
      <template v-slot:top>
        <v-card-title>
          <v-btn small color="boton" class="mb-2 white--text" @click="nuevo = true">
            Nuevo
            <v-icon>
              mdi-plus-circle-outline
            </v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-text-field v-model="buscar" label="Buscar" append-icon="mdi-magnify" hide-details single-line></v-text-field>
        </v-card-title>
      </template>

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

    <v-dialog v-model="nuevo" max-width="600" persistent>
      <v-card>
        <v-card-title>
          <v-col cols="12" sm="12" md="12">
            <v-alert dense text outlined color="info" icon="mdi-account-edit-outline"><b>Crear Grupo</b>
            </v-alert>
          </v-col>
          <v-col cols="12" sm="12" md="12">
            <v-text-field label="Nombre" v-model="grupo.nombre">
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="12" md="12">
            <v-text-field label="Codigo" v-model="grupo.codigo">
            </v-text-field>
          </v-col>
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" small @click="cerrarNuevo" dark>
            Cerrar
          </v-btn>
          <v-btn color="success" small @click="crearGrupo()">
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="editarGrupo" max-width="600" persistent>
      <v-card>
        <v-card-title>
          <v-col cols="12" sm="12" md="12">
            <v-alert dense text outlined color="info" icon="mdi-account-edit-outline"><b>Editar grupo</b>
            </v-alert>
          </v-col>
          <v-col cols="12" sm="12" md="12">
            <v-text-field label="Nombre" v-model="grupoEditar.nombre">
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="12" md="12">
            <v-text-field label="Codigo" v-model="grupoEditar.codigo">
            </v-text-field>
          </v-col>
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" small @click="editarGrupo = false" dark>
            Cerrar
          </v-btn>
          <v-btn color="orange" small dark @click="actualizarGrupo()">
            Actualizar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </div>
</template>

<script>
export default {
  data() {
    return {
      preload: false,
      grupos: [],
      buscar: "",
      nuevo: false,
      editarGrupo: false,
      grupoEditar: {
        nombre: '',
        codigo: ''
      },
      grupo: {
        nombre: '',
        codigo: ''
      },
      headers: [
        {
          text: 'Id',
		  sortable: false,
          value: 'id'
        },
        {
          text: 'Nombre',
		  sortable: false,
          value: 'nombre'
        },
        {
          text: 'Codigo',
		  sortable: false,
          value: 'codigo'
        },
        {
          text: 'Acciones',
		  sortable: false,
          value: 'actions'
        }
      ]
    }
  },
  mounted() {
    this.listargrupos()
  },

  methods: {
    listargrupos() {
      this.preload = true;
      this.$axios.get('/grupos/listar')
        .then(res => {
          this.grupos = res.data;
          this.preload = false;
        })
        .catch(error => {
          this.$toast.error(error.response.data.mensaje);
        });
    },

    cerrarNuevo() {
      this.nuevo = false,
        this.grupo = {
          nombre: '',
          codigo: '',
        }
    },

    editar(item) {
      this.grupoEditar = { ...item };
      this.editarGrupo = true;
    },

    crearGrupo() {
      if (this.grupo.nombre.length <= 0) {
        return this.$swal({
          title: "¡No puede ser!",
          text: "El nombre y el codigo del grupo son obligatorios",
          type: "warning",
        });
      }
      this.$axios.post('/grupos/crear', this.grupo)
        .then(response => {
          this.preload = false;
          this.$toast.success('Grupo creado exitosamente');
          this.nuevo = false;
          this.listargrupos();
        })
        .catch(error => {
          this.preload = false;
          this.$toast.error(error.response.data.mensaje);
        });
    },

    actualizarGrupo() {
      this.preload = true;
      this.$axios.put(`/grupos/actualizar/${this.grupoEditar.id}`, this.grupoEditar)
        .then(response => {
          this.preload = false;
          this.$toast.success('Grupo actualizado exitosamente');
          this.editarGrupo = false;
          this.listargrupos();
        })
        .catch(error => {
          this.preload = false;
          this.$toast.error(error.response.data.mensaje);
        });
    }

  }
}
</script>
