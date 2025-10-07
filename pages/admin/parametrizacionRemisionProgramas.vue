<template>
  <div>
    <v-card>
      <v-card-title>
        <v-toolbar flat>
          <v-toolbar-title>
            <div class="d-flex align-center">
              <img src="/images/ojo.svg" alt="" height="50px" width="50px">
              <span>Parametrizacion Remision Programas</span>
            </div>
          </v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
        </v-toolbar>
      </v-card-title>

      <v-container fluid>
        <v-row dense>
          <v-col cols="6">
            <v-btn @click="abrirDialogo()" small color="success">
              Crear<v-icon right>mdi-plus</v-icon>
            </v-btn>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <v-text-field v-model="buscar" label="Buscar" hint="Puede buscar por cualquier campo de la tabla" dense>
            </v-text-field>
          </v-col>
        </v-row>
      </v-container>
      <v-data-table :items="programas" :headers="headers" :loading="loading">
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)" color="warning">
            mdi-pencil
          </v-icon>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog max-width="800px" v-model="dialogCrear" persistent>
      <v-card>
        <v-alert text dense color="info" border="left" icon="mdi-plus-box-multiple-outline">
          <b>{{ editando ? 'Editar programa' : 'Crear programa' }}</b>
        </v-alert>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6" md="6">
              <v-text-field label="Nombre" v-model="programa.nombre" dense outlined></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="6">
              <v-text-field label="Edad inicial" type="number" v-model="programa.edad_inicial" dense outlined>
              </v-text-field>
            </v-col>
            <v-col cols="6" sm="6" md="6">
              <v-text-field label="Edad final" type="number" v-model="programa.edad_final" dense outlined>
              </v-text-field>
            </v-col>
            <v-col cols="6" sm="6" md="6">
              <v-autocomplete label="Sexo" dense outlined :items="sexos" v-model="programa.sexo"></v-autocomplete>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" small @click="CerrarDialog" dark>Cerrar</v-btn>
          <v-btn color="success" small @click="guardarPrograma()" :loading="loadingGuardar">
            {{ editando ? 'Actualizar' : 'Crear' }}
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
        buscar: '',
        dialogCrear: false,
        editando: false,
        programa: {
          id: null,
          nombre: '',
          edad_final: '',
          edad_inicial: '',
          sexo: '',
          estado: true
        },
        loadingGuardar: false,
        programas: [],
        loading: false,
        headers: [{
            text: 'Nombre',
            value: 'nombre'
          },
          {
            text: 'Edad Inicial',
            value: 'edad_inicial'
          },
          {
            text: 'Edad final',
            value: 'edad_final'
          },
          {
            text: 'Sexo',
            value: 'sexo'
          },
          {
            text: 'Acciones',
            value: 'actions'
          }
        ],
        sexos: [
          'M',
          'F',
          'A'
        ]
      }
    },

    mounted() {
      this.listarProgramas()
    },

    methods: {
      abrirDialogo() {
        this.dialogCrear = true;
        this.editando = false;
      },

      editItem(item) {
        this.programa = {
          ...item
        };
        this.dialogCrear = true;
        this.editando = true;
      },

      guardarPrograma() {
        this.loadingGuardar = true;
        if (this.editando) {
          this.$axios.put(`parametrizacionRemisionProgramas/actualizar/${this.programa.id}`, this.programa)
            .then(() => {
              this.$toast.success('Actualizado con éxito');
              this.CerrarDialog();
              this.listarProgramas();
            })
            .catch((error) => {
              console.log(error);
            })
            .finally(() => {
              this.loadingGuardar = false;
            });
        } else {
          this.$axios.post('parametrizacionRemisionProgramas/crear', this.programa)
            .then(() => {
              this.$toast.success('Creado con éxito');
              this.CerrarDialog();
              this.listarProgramas();
            })
            .catch((error) => {
              console.log(error);
            })
            .finally(() => {
              this.loadingGuardar = false;
            });
        }
      },

      listarProgramas() {
        this.loading = true
        this.$axios.get('parametrizacionRemisionProgramas/listar').then((res) => {
          this.programas = res.data
        }).catch((error) => {
          console.log(error)
        }).finally(() => {
          this.loading = false
        })
      },
      CerrarDialog() {
        this.dialogCrear = false;
        this.programa = {}
      }
    }
  }

</script>
