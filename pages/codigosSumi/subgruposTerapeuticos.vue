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

    <v-data-table :headers="headers" :items="subgrupos" :search="buscar" dense :footer-props="{
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
            <v-alert dense text outlined color="info" icon="mdi-medical-bag"><b>Crear Subgrupo Terapeutico</b>
            </v-alert>
          </v-col>
          <v-col cols="12" sm="12" md="12">
            <v-text-field label="Nombre" v-model="subgrupo.nombre">
            </v-text-field>
          </v-col>
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" small @click="cerrarNuevo" dark>
            Cerrar
          </v-btn>
          <v-btn color="success" small @click="crearSubgrupoTerapeutico()">
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="editarSubgrupo" max-width="600" persistent>
      <v-card>
        <v-card-title>
          <v-col cols="12" sm="12" md="12">
            <v-alert dense text outlined color="info" icon="mdi-medical-bag"><b>Editar Subgrupo Terapeutico</b>
            </v-alert>
          </v-col>
          <v-col cols="12" sm="12" md="12">
            <v-text-field label="Nombre" v-model="subgrupo_editar.nombre">
            </v-text-field>
          </v-col>
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" small @click="editarSubgrupo = false" dark>
            Cerrar
          </v-btn>
          <v-btn color="orange" small dark @click="actualizarSubgrupo()">
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
      subgrupos: [],
      buscar: '',
      nuevo: false,
      editarSubgrupo: false,
      subgrupo_editar: {
        nombre: ''
      },
      subgrupo: {
        nombre: ''
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
          text: 'Acciones',
		  sortable: false,
          value: 'actions'
        }
      ]
    }
  },

  mounted() {
    this.listarSubgrupos()
  },

  methods: {
    cerrarNuevo() {
      this.nuevo = false,
        this.subgrupo = {
          nombre: '',
        }
    },

    editar(item) {
      this.subgrupo_editar = { ...item };
      this.editarSubgrupo = true;
    },

    listarSubgrupos() {
      this.preload = true;
      this.$axios.get('/subgrupos-terapeuticos/listar')
        .then(res => {
          this.subgrupos = res.data;
          this.preload = false;
        })
        .catch(error => {
          this.$toast.error(error.response.data.mensaje);
        });
    },

    crearSubgrupoTerapeutico() {
      if (this.subgrupo.nombre.length <= 0) {
        return this.$swal({
          title: "¡No puede ser!",
          text: "El nombre del subgrupo es obligatorio",
          type: "warning",
        });
      }      this.$axios.post('/subgrupos-terapeuticos/crear', this.subgrupo)
        .then(response => {
          this.preload = false;
          this.$toast.success('Subgrupo Terapeutico creado exitosamente');
          this.nuevo = false;
          this.listarSubgrupos();
        })
        .catch(error => {
          this.preload = false;
          this.$toast.error(error.response.data.mensaje);
        });
    },

    actualizarSubgrupo() {
      this.preload = true;
      this.$axios.put(`/subgrupos-terapeuticos/actualizar/${this.subgrupo_editar.id}`, { nombre: this.subgrupo_editar.nombre })
        .then(() => {
          this.preload = false;
          this.subgrupo_editar = { nombre: '' };
          this.$toast.success('Subgrupo Terapeutico se ha actualizado correctamente.');
          this.editarSubgrupo = false;
          this.listarSubgrupos();
        })
        .catch(error => {
          this.preload = false;
          this.$toast.error(error.response.data.mensaje);
        });
    },

  }
}
</script>
