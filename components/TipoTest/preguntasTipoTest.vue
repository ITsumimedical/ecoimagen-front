<template>
  <div>
    <v-data-table dense :headers="headers" :search="buscar" sort-by="id" :items="preguntas" loading-text="Cargando..."
      no-data-text="Sin datos para mostrar">
      <template v-slot:top>
        <v-card-title>
          <v-btn small color="boton" class="mb-2 white--text" @click="abrirDialogoCrear">
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
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-icon color="warning" @click="abrirDialogoEditar(item)" v-bind="attrs" v-on="on">
              mdi-pencil
            </v-icon>
          </template>
          <span>Editar</span>
        </v-tooltip>
      </template>

    </v-data-table>

    <v-dialog max-width="900px" v-model="dialogoActivo" persistent>
      <v-card>
        <v-alert icon="mdi-checkbox-marked-circle-plus-outline" dense text :color="editar ? 'warning' : 'info'">
          <b>{{ editar ? 'Editar pregunta' : 'Crear pregunta' }}</b>
        </v-alert>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6" md="6">
              <v-text-field label="Pregunta" v-model="form.pregunta" outlined dense></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="6">
              <v-autocomplete label="Tipo test" item-value="id" item-text="nombre" :items="tipoTest"
                v-model="form.tipo_test_id" outlined dense>
              </v-autocomplete>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" dark small @click="cerrarDialog()">Cerrar</v-btn>
          <v-btn small :color="editar ? 'warning' : 'success'" @click="guardarPregunta()" :loading="cargando"
            :disabled="cargando">
            {{ editar ? 'Actualizar' : 'Guardar' }}
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
        preguntas: [],
        tipoTest: [],
        dialogoActivo: false,
        editar: false,
        cargando: false,
        form: {
          id: null,
          pregunta: '',
          tipo_test_id: ''
        },
        headers: [{
            text: 'Id',
            value: 'id'
          },
          {
            text: 'Pregunta',
            value: 'pregunta'
          },
          {
            text: 'Tipo de test',
            value: 'tipo_test'
          },
          {
            text: 'Acciones',
            value: 'actions'
          }
        ]
      };
    },

    mounted() {
      this.listarPreguntas();
    },

    methods: {
      listarPreguntas() {
        this.$axios.get('preguntasTipoTest/listar').then(res => {
          this.preguntas = res.data;
        }).catch(error => {
          console.log(error);
          this.$toast.error('Error al listar');
        });
      },

      listarTipoTest() {
        this.$axios.get('tipoTest/listar').then(res => {
          this.tipoTest = res.data;
        }).catch(error => {
          console.log(error);
          this.$toast.error('Error al listar los tipos de test');
        });
      },

      abrirDialogoCrear() {
        this.listarTipoTest()
        this.editar = false;
        this.form = {
          id: null,
          pregunta: '',
          tipo_test_id: ''
        };
        this.dialogoActivo = true;
      },

      abrirDialogoEditar(item) {
        this.listarTipoTest()
        this.editar = true;
        this.form = {
          ...item
        };
        this.dialogoActivo = true;
      },

      cerrarDialog()
      {
        this.dialogoActivo = false;
        this.form = {
          id: '',
          pregunta: '',
          tipo_test_id: ''
        }
      },

      guardarPregunta() {
        this.cargando = true;
        const url = this.editar ? `preguntasTipoTest/actualizar/${this.form.id}` : 'preguntasTipoTest/crearPreguntas';
        const metodo = this.editar ? 'put' : 'post';

        this.$axios[metodo](url, this.form).then(res => {
          this.$toast.success(`Pregunta ${this.editar ? 'actualizada' : 'creada'} con éxito`);
          this.dialogoActivo = false;
          this.listarPreguntas();
        }).catch(error => {
          console.log(error);
          this.$toast.error(`Error al ${this.editar ? 'actualizar' : 'crear'} la pregunta`);
        }).finally(() => {
          this.cargando = false;
        });
      }
    }
  };

</script>
