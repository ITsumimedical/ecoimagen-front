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

    <v-data-table :headers="headers" :items="formas" :search="buscar" dense :footer-props="{
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

        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-icon color="error" small class="mr-2" v-bind="attrs" v-on="on" @click="eliminar(item)">
              mdi-delete-alert
            </v-icon>
          </template>
          <span>Eliminar</span>
        </v-tooltip>
      </template>
    </v-data-table>

    <v-dialog v-model="nuevo" max-width="600" persistent>
      <v-card>
            <v-alert dense text outlined color="success" icon="mdi-needle" border="bottom"><b>Crear Forma Farmaceutica</b>
            </v-alert>
        <v-card-text>
          <v-col cols="12" sm="12" md="12">
            <v-text-field label="Nombre" outlined v-model="farmaceutica.nombre" dense>
            </v-text-field>
          </v-col>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" small @click="cerrarNuevo" dark>
            Cerrar
          </v-btn>
          <v-btn color="success" small @click="crearFormaFarmaceutica()">
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="editarForma" max-width="600" persistent>
      <v-card>
          <v-alert dense text outlined color="warning" icon="mdi-needle" border="bottom"><b>Editar Forma Farmaceutica</b>
          </v-alert>
          <v-card-text>
          <v-col cols="12" sm="12" md="12">
            <v-text-field label="Nombre" v-model="forma_editar.nombre">
            </v-text-field>
          </v-col>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" small @click="editarForma = false" dark>
            Cerrar
          </v-btn>
          <v-btn color="orange" small dark @click="actualizarForma()">
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
      formas: [],
      buscar: '',
      nuevo: false,
      editarForma: false,
      forma_editar: {
        nombre: ''
      },
      farmaceutica: {
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
    this.listarFormas()
  },

  methods: {
    cerrarNuevo() {
      this.nuevo = false,
        this.farmaceutica = {
          nombre: '',
        }
    },

    crearFormaFarmaceutica() {

      if (this.farmaceutica.nombre.length <= 0) {
        return this.$swal({
          title: "¡No puede ser!",
          text: "El nombre de la forma farmaceutica es obligatorio",
          type: "warning",
        });
      }

      this.$axios.post('/formas-farmaceuticas/crear', this.farmaceutica)
        .then(response => {
          this.preload = false;
          this.$toast.success('Forma Farmaceutica creada exitosamente');
          this.nuevo = false;
          this.listarFormas();
        })
        .catch(error => {
          this.preload = false;
          this.$toast.error(error.response.data.mensaje);
        });
    },

    listarFormas() {
      this.preload = true;
      this.$axios.get('/formas-farmaceuticas/listar')
        .then(res => {
          this.formas = res.data;
          this.preload = false;
        })
        .catch(error => {
          this.$toast.error(error.response.data.mensaje);
        });
    },
    actualizarForma() {
      this.preload = true;
      this.$axios.put(`/formas-farmaceuticas/actualizar/${this.forma_editar.id}`, { nombre: this.forma_editar.nombre })
        .then(() => {
          this.preload = false;
          this.forma_editar = { nombre: '' };
          this.$toast.success('Forma Farmaceutica se ha actualizado correctamente.');
          this.editarForma = false;
          this.listarFormas();
        })
        .catch(error => {
          this.preload = false;
          this.$toast.error(error.response.data.mensaje);
        });
    },
    editar(item) {
      this.forma_editar = { ...item };
      this.editarForma = true;
    },

    eliminar(item) {
        return this.$swal({
        title: "Atención!",
        text: "¿Está seguro de eliminar esta forma farmacéutica?",
        type: "warning",
        confirmButtonText: "Sí",
        cancelButtonText: "Cancelar",
        showCancelButton: true,
        }).then((res) => {
            if(res.value) {
                this.$axios.delete('formas-farmaceuticas/eliminar/' + item.id).then(() => {
                    this.$toast.success('Forma Farmaceutica eliminada correctamente');
                    this.listarFormas()
                })
            }
        }).catch((error) => {
            this.$toast.error('Error al eliminar la forma farmaceutica');
            console.log(error.response.data.error)
        })
    }
  }
}
</script>
