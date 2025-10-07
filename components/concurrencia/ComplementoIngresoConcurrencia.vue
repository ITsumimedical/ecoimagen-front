<template>
  <div>
    <!-- complemento ingreso concurrencia -->
    <v-row dense>
      <v-col cols="11" sm="11" md="11">
        <v-alert text dense border="left" color="blue-grey" icon="mdi-mother-heart">Información gestantes
        </v-alert>
      </v-col>
      <v-col cols="1">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on" icon @click="registrarComplemento = true">
              <v-icon>mdi-plus-circle-outline</v-icon>
            </v-btn>
          </template>
          <span>Agregar infomación</span>
        </v-tooltip>
      </v-col>
    </v-row>
    <v-form v-if="this.registrarComplemento == true">
      <v-container fluid>
        <v-row dense>
          <v-col cols="12" sm="3" md="3">
            <v-text-field type="number" min="0" v-model="formComplemento.peso_neonato" dense label="Peso neonato">
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="3" md="3">
            <v-text-field type="number" min="0" v-model="formComplemento.edad_gestacional" dense
              label="Edad gestacional">
            </v-text-field>
          </v-col>
          <v-col cols="4">
            <v-btn small color="success" @click="guardarComplemento()">Registrar<v-icon right>mdi-plus
              </v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
    <div v-if="this.complementos.length > 0">
      <v-alert icon="mdi-history" text dense border="left" color="info">Histórico registros de gestantes</v-alert>
      <v-data-table dense no-data-text="Aún no hay registros" :headers="headersComplementos" :items="complementos">
        <template v-slot:[`item.acciones`]="{ item }">
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on">
                <v-icon small color="error" @click="eliminarComplemento(item)">
                  mdi-delete
                </v-icon>
              </v-btn>
            </template>
            <span>Eliminar</span>
          </v-tooltip>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'WorkspaceJsonComplementoIngresoConcurrencia',

    data() {
      return {
        registrarComplemento: false,
        formComplemento: {
          peso_neonato: '',
          edad_gestacional: '',
          ingreso_concurrencia_id: '',
        },
        complementos: [],
        headersComplementos: [{
            text: 'id',
            value: 'id',
          },
          {
            text: 'Peso neonato',
            align: 'start',
            sortable: false,
            value: 'peso_neonato',
          },
          {
            text: 'Edad gestacional',
            value: 'edad_gestacional',
            sortable: false,
          },
          {
            text: 'Acciones',
            value: 'acciones',
            sortable: false,
          },
        ],
      };
    },

    props: {
      IngresoConcurrencia: {
        type: Number,
        default: {},
      }
    },

    mounted() {
      this.listarComplemento()
    },

    methods: {

      guardarComplemento() {
        if (this.formComplemento.peso_neonato == '' || this.formComplemento.edad_gestacional == '') {
          return this.$toast.error('Debe llenar todos los campos')
        }
        this.formComplemento.ingreso_concurrencia_id = this.IngresoConcurrencia
        this.$axios.post('/concurrencia/complementar', this.formComplemento)
          .then(res => {
            this.$toast.success('Se ha registrado el complemento correctamente!.')
            this.formComplemento.edad_gestacional = ''
            this.formComplemento.peso_neonato = ''
            this.listarComplemento()
          }).catch(e => {
            console.log('error', e);
          })
      },

      listarComplemento() {
        this.$axios.get('/concurrencia/complemento/' + this.IngresoConcurrencia)
          .then(res => {
            this.complementos = res.data
          }).catch(e => {
            console.log(e.response.data);
          })
      },

      eliminarComplemento(item) {
        this.$axios.post('/concurrencia/eliminarComplementos/', {id:item.id})
          .then(res => {
            this.listarComplemento()
            return this.$toast.error('Se ha eliminado el complemento correctamente!.')
          }).catch(e => {
            console.log(e);
          })
      },
    },
  };

</script>
