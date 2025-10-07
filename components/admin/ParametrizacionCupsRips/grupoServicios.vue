<template>
  <div>
    <v-alert color="blue-grey darken-1"  icon="mdi-file-code" text dense border="left"><b>Grupo servicios</b></v-alert>
    <v-data-table :loading="loading" :disabled="loading" :search="buscar" dense :items="gruposServicios" :headers="headers">
      <template v-slot:top>
        <v-card-title>
          <v-btn small color="boton" class="mb-2 white--text" @click="abrirDialogoCrear()">
            Nuevo
            <v-icon right>
              mdi-plus-circle-outline
            </v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-text-field v-model="buscar" label="Buscar" append-icon="mdi-magnify" hide-details single-line>
          </v-text-field>
        </v-card-title>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-btn color="warning" icon small @click="abrirDialogoEditar(item)">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </template>
    </v-data-table>

    <v-dialog max-width="900px" v-model="crearNuevoGrupo" persistent>
      <v-card>
        <v-alert text dense color="info" border="left" icon="mdi-checkbox-marked-circle-plus-outline">
          <b>{{ esEditar ? 'Editar grupo servicios' : 'Crear nuevo grupo servicios' }}</b>
        </v-alert>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6" md="6">
              <v-text-field label="Código" v-model="grupo.codigo" outlined dense></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="6">
              <v-text-field label="Nombre" v-model="grupo.nomnbre" outlined dense></v-text-field>
            </v-col>
          </v-row>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn small color="red" dark @click="cerrarDialogo()">Cerrar</v-btn>
            <v-btn small @click="guardarGrupo":color="esEditar ? 'warning' : 'success'">{{ esEditar ? 'Actualizar' : 'Guardar' }}</v-btn>
          </v-card-actions>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        buscar: '',
        loading: false,
        crearNuevoGrupo: false,
        esEditar: false,
        gruposServicios: [],
        grupo: {
          codigo: '',
          nomnbre: ''
        },
        headers: [{
            text: 'id',
            value: 'id'
          },
          {
            text: 'Código',
            value: 'codigo'
          },
          {
            text: 'Nombre',
            value: 'nomnbre'
          },
          {
            text: 'Acciones',
            value: 'actions',
            sortable: false
          }
        ]
      }
    },

    mounted() {
      this.listar()
    },
    methods: {
      abrirDialogoCrear() {
        this.esEditar = false;
        this.grupo = {
          codigo: '',
          nomnbre: ''
        };
        this.crearNuevoGrupo = true;
      },

      abrirDialogoEditar(item) {
        this.esEditar = true;
        this.grupo = {
          ...item
        };
        this.crearNuevoGrupo = true;
      },

      guardarGrupo() {
        if (this.esEditar) {
          this.actualizarGrupo();
        } else {
          this.crearGrupo();
        }
      },

      crearGrupo() {
        if(this.grupo.codigo == '' || this.grupo.nomnbre == '') {
          return this.$toast.error('Debes diligenciar todos los campos')
        }
        this.$axios.post('grupoServicios/crear', this.grupo)
          .then(() => {
            this.$toast.success('Creado con éxito');
            this.crearNuevoGrupo = false;
            this.listar()
          })
          .catch(error => {
            console.log(error);
          });
      },

      actualizarGrupo() {
        this.$axios.put(`grupoServicios/actualizar/${this.grupo.id}`, this.grupo)
          .then(() => {
            this.$toast.success('Actualizado con éxito');
            this.crearNuevoGrupo = false;
            this.listar()
          })
          .catch(error => {
            console.log(error);
          });
      },

      listar() {
        this.loading = true;
        this.$axios.get('grupoServicios/listar').then(res => {
          this.gruposServicios = res.data
        }).catch(error => {
          console.log(error)
        }).finally(res => {
          this.loading = false
        })
      },

      cerrarDialogo() {
        this.crearNuevoGrupo = false;
        this.grupo = {
          codigo: '',
          nomnbre: ''
        }
      }
    }
  }

</script>
