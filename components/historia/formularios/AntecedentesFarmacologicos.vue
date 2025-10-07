<template>
  <div>
    <template>
      <v-dialog v-model="preload" persistent width="300">
        <v-card color="primary" dark>
          <v-card-text>
            Procesando Información
            <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
          </v-card-text>
        </v-card>
      </v-dialog>
    </template>
    <v-card elevation="0">
      <v-container fluid>
        <v-alert class="text-center" dense text type="info" icon="mdi-pill-off" border="left">
          <b>ALERGIA A MEDICAMENTOS</b></v-alert>
        <v-row dense>
          <v-col cols="12" sm="5" md="5" v-if="noTieneAntecedente != 'No tiene antecedentes alergicos a medicamentos'">
            <v-autocomplete v-model="antecedentesFarma.principio_activo_id" :items="principiosActivos"
              item-text="nombre" no-data-text="Debe ingresar el nombre del medicamento" item-value="id"
              label="Digita el nombre de medicamento">
            </v-autocomplete>
          </v-col>
          <v-col cols="12" sm="6" md="6" v-if="noTieneAntecedente != 'No tiene antecedentes alergicos a medicamentos'">
            <v-text-field label="Observación Alergia" v-model="antecedentesFarma.observacion_medicamento">
            </v-text-field>
          </v-col>
          <v-col cols="1" sm="1" md="1" v-if="noTieneAntecedente != 'No tiene antecedentes alergicos a medicamentos'">
            <v-btn color="boton" class="mt-5" block small dark @click="guardarAlergiaMedicamento('medicamento')">Agregar
            </v-btn>
          </v-col>
          <v-col cols="12" sm="12" md="12"
            v-if="noTieneAntecedente != 'No tiene antecedentes alergicos a medicamentos'">
            <v-data-table :loading="loading" :disable="loading" :items="alergiaMedicamento" :headers="hola" dense>
              <template v-slot:[`item.acciones`]="{ item }">
                <v-tooltip bottom >
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon v-if="item.user_id === $store.state.auth.usuario.id" small v-bind="attrs" v-on="on" @click="eliminarItem(item)" color="red">
                      mdi-delete
                    </v-icon>
                  </template>
                  <span>Eliminar</span>
                </v-tooltip>
              </template>
            </v-data-table>
          </v-col>

          <v-col cols="12" md="12" sm="12" v-if="alergiaMedicamento.length == 0">
            <v-col cols="12" md="12" sm="12">
              <v-alert text dense color="blue-grey" class="text-center" icon="mdi-checkbox-marked-circle-plus-outline"
                border="left">
                <b>No posee antecedentes alergicos a medicamentos</b>
              </v-alert>
            </v-col>

            <v-row dense>
              <v-col cols="auto">
                <v-checkbox label="Marcar en caso de que el afiliado no posea antecedentes de alergia a medicamentos"
                  v-model="noTieneAntecedente" value="No tiene antecedentes alergicos a medicamentos"></v-checkbox>
              </v-col>
              <v-col cols="auto">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn color="success" small outlined fab v-bind="attrs" v-on="on" @click="guardarNotieneAlergia()">
                      <v-icon>mdi-plus</v-icon>
                    </v-btn>
                  </template>
                  <span>guardar</span>
                </v-tooltip>
              </v-col>
            </v-row>
          </v-col>
          <!-- <v-col cols="12" sm="12" md="12">
            <v-alert class="text-center" dense text outlined type="info" color="blue-grey"
              icon="mdi-book-open-page-variant">
              <b>ALERGIA AMBIENTAL</b></v-alert>
          </v-col>
          <v-col cols="12" sm="5" md="5">
            <v-text-field label="Ambiental" v-model="antecedentesFarma.ambiental">
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <v-text-field label="Observación Alergia" v-model="antecedentesFarma.observacion_ambiental">
            </v-text-field>
          </v-col>
          <v-col cols="1" sm="1" md="1">
            <v-btn color="boton" class="mt-5" block small dark @click="guardarAlergiaMedicamento('Ambiental')">Agregar
            </v-btn>
          </v-col>
          <v-col cols="12" sm="12" md="12">
            <v-data-table :loading="loading" :disable="loading" :items="alergiaAmbiental" :headers="ambientales" dense>
            </v-data-table>
          </v-col> -->
          <v-row dense>
            <v-col v-show="datos.cita.tipo_historia_id !== 1" cols="12" sm="12" md="12">
              <v-alert class="text-center" dense text border="left" type="info" color="blue-grey"
                icon="mdi-food-drumstick-off">
                <b>ALERGIA ALIMENTOS</b></v-alert>
            </v-col>
            <v-col v-show="datos.cita.tipo_historia_id !== 1" cols="12" sm="5" md="5">
              <v-text-field label="Alimento" v-model="antecedentesFarma.alimento">
              </v-text-field>
            </v-col>
            <v-col v-show="datos.cita.tipo_historia_id !== 1" cols="12" sm="6" md="6">
              <v-text-field label="Observación Alergia" v-model="antecedentesFarma.observacion_alimento">
              </v-text-field>
            </v-col>
            <v-col v-show="datos.cita.tipo_historia_id !== 1" cols="1" sm="1" md="1">
              <v-btn color="boton" class="mt-5" block small dark @click="guardarAlergiaMedicamento('Alimento')">Agregar
              </v-btn>
            </v-col>
            <v-col v-show="datos.cita.tipo_historia_id !== 1" cols="12" sm="12" md="12">
              <v-data-table :loading="loading" :disable="loading" :items="alergiaAlimento" :headers="alimnetos" dense>
                <template v-slot:[`item.acciones`]="{ item }">
                <v-tooltip bottom >
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon small v-bind="attrs" v-on="on" @click="eliminarItem(item)" color="red" v-if="item.user_id === $store.state.auth.usuario.id">
                      mdi-delete
                    </v-icon>
                  </template>
                  <span>Eliminar</span>
                </v-tooltip>
              </template>
              </v-data-table>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col v-show="datos.cita.tipo_historia_id !== 1" cols="12" sm="12" md="12">
              <v-alert class="text-center" dense text border="left" type="info" color="blue-grey" icon="mdi-allergy">
                <b>OTRAS ALERGIAS</b></v-alert>
            </v-col>
            <v-col v-show="datos.cita.tipo_historia_id !== 1" cols="12" sm="5" md="5">
              <v-text-field label="Otros" v-model="antecedentesFarma.otras">
              </v-text-field>
            </v-col>
            <v-col v-show="datos.cita.tipo_historia_id !== 1" cols="12" sm="6" md="6">
              <v-text-field label="Observación Alergia" v-model="antecedentesFarma.observacion_otro">
              </v-text-field>
            </v-col>
            <v-col v-show="datos.cita.tipo_historia_id !== 1" cols="1" sm="1" md="1">
              <v-btn color="boton" class="mt-5" block small dark @click="guardarAlergiaMedicamento('Otras')">Agregar
              </v-btn>
            </v-col>
            <v-col v-show="datos.cita.tipo_historia_id !== 1" cols="12" sm="12" md="12">
              <v-data-table :loading="loading" :disable="loading" :items="otrasAlergias" :headers="otras" dense>
                <template v-slot:[`item.acciones`]="{ item }">
                <v-tooltip bottom >
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon small v-bind="attrs" v-on="on" @click="eliminarItem(item)" color="red" v-if="item.user_id === $store.state.auth.usuario.id">
                      mdi-delete
                    </v-icon>
                  </template>
                  <span>Eliminar</span>
                </v-tooltip>
              </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-row>
      </v-container>
    </v-card>


  </div>
</template>
<script>
export default {
  name: "",
  props: {
    datos: Object,
    ocupacional: Array
  },
  created() {
    // this.antecedentesFarma.consulta_id = this.datos.id;
    // if (this.ocupacional !== undefined) {
    //   this.antecedentesFarma.consulta_id = this.ocupacional[0].id_CONSULTA
    // }
    this.listarPrincipiosActivos()
    this.listarAlergiasMedicamento()
    this.listarAlergiasAlimentos()
    this.listarOtras()
  },
  data() {
    return {
      // operadorId: $store.state.auth.usuario.id,
      medicamentos: [],
      alergiaAlimento: [],
      alergiaAmbiental: [],
      otrasAlergias: [],
      noTieneAntecedente: null,
      medicamento: '',
      preload: false,
      loading: false,
      principiosActivos: [],
      antecedentesFarma: {
        medicamento_id: '',
        utiempo: '',
        frecuencia: '',
        alergia: '',
        Alimneto: '',
        Ambientales: '',
        OtrasAlergias: '',
        observacionmedicamento: '',
        observacionalimneto: '',
        observacionambiental: '',
        observacionotras: '',
        principio_activo_id: ''
      },

      sino: ['SI', 'NO'],
      alergiaMedicamento: [],
      hola: [{
        text: 'Fecha',
        value: 'created_at'
      },
      {
        text: 'Medicamento',
        value: 'principioAlergia'
      },
      {
        text: 'Observación',
        value: 'observacion_medicamento'
      },
      {
        text: 'Registrado por',
        value: 'operador'
      },
      {
        text: 'Acciones',
        value: 'acciones',
        align: 'center'
      }
      ],
      alimnetos: [{
        text: 'Fecha',
        value: 'created_at'
      },
      {
        text: 'Alimento',
        value: 'alimento'
      },
      {
        text: 'Observación',
        value: 'observacion_alimento'
      },
      {
        text: 'Registrado por',
        value: 'operador'
      },
      {
        text: 'Acciones',
        value: 'acciones',
        align: 'center',
      },
      ],
      ambientales: [{
        text: 'Fecha',
        value: 'created_at'
      },
      {
        text: 'Ambiental',
        value: 'ambiental'
      },
      {
        text: 'Observación',
        value: 'observacion_ambiental'
      },
      {
        text: 'Registrado por',
        value: 'operador'
      },
      {
        text: 'Acciones',
        value: 'acciones',
        align: 'center',
      },
      ],
      otras: [{
        text: 'Fecha',
        value: 'created_at'

      },
      {
        text: 'Otras alergias',
        value: 'otras'
      },
      {
        text: 'Observación',
        value: 'observacion_otro'
      },
      {
        text: 'Registrado por',
        value: 'operador'
      },
      {
        text: 'Acciones',
        value: 'acciones',
        align: 'center',
      },
      ]

    }
  },
  methods: {
    validarErrores() {
      return [];
    },

    listarPrincipiosActivos() {
      this.preload = true;
      this.$axios.get('principios-activos/listar').then((res) => {
        this.principiosActivos = res.data
      }).catch((error) => {
        console.log(error)
      }).finally(() => {
        this.preload = false
      })
    },


    listarAlergiasMedicamento() {
      this.loading = true;
      let data = {}
      data.afiliado = this.datos.afiliado_id;
      if (this.ocupacional !== undefined) {
        data.afiliado = this.ocupacional[0].afiliado_id
      }
      this.$axios.post("/antecedentes-alergicos/listarAlergiaMedicamentos", {
        afiliado: data.afiliado
      })
        .then((res) => {
          this.loading = false;
          this.alergiaMedicamento = res.data;
        })
        .catch((err) => {
          this.loading = false;
          return this.$toast.error("Error al listar antecedentes personales");
        });
    },

    guardarAlergiaMedicamento(item) {
      let texto = item
      if (texto == 'Ambiental') {
        if (this.antecedentesFarma.ambiental == null) {
          return this.$toast.error("Debe llenar los campos");
        }
      } else if (texto == 'medicamento') {
        if (this.antecedentesFarma.principio_activo_id == null) {
          return this.$toast.error("Debe seleccionar el medicamento");
        }
      } else if (texto == 'Alimento') {
        if (this.antecedentesFarma.alimento == null) {
          return this.$toast.error("Debe seleccionar el alimento");
        }
      } else {
        if (this.antecedentesFarma.otras == null) {
          return this.$toast.error("Debe agregar la otra alergia");
        }
      }

      this.antecedentesFarma.consulta_id = this.datos.id;
      if (this.ocupacional !== undefined) {
        this.antecedentesFarma.consulta_id = this.ocupacional[0].id_CONSULTA;
      }
      this.preload = true
      this.antecedentesFarma.medico_registra = this.$store.state.auth.usuario.id
      this.$axios.post("/antecedentes-alergicos/guardar", this.antecedentesFarma)
        .then((res) => {
          this.$toast.success(res.data.mensaje);
          this.limpiarFiltro();
          this.preload = false
        })
        .catch((err) => {
          console.log(err);
          return this.$toast.error('No hay antecedentes pre-guardados para almacenar');
        });
    },

    guardarNotieneAlergia() {
      const data = {
        consulta_id: this.datos.id,
        medico_registra: this.$store.state.auth.usuario.id,
        no_tiene_antecedentes: this.noTieneAntecedente
      };
      this.$axios.post('antecedentes-alergicos/guardar', data).then(res => {
        this.$toast.success('Agregado con éxito');
      }).catch(error => {
        this.$toast.error(error)
      })

    },

    limpiarFiltro() {
      for (const prop of Object.getOwnPropertyNames(
        this.antecedentesFarma
      )) {
        this.antecedentesFarma[prop] = null;
      }
      this.listarAlergiasMedicamento();
      this.listarAlergiasAmbientales()
      this.listarAlergiasAlimentos()
      this.listarOtras()
    },

    listarAlergiasAmbientales() {
      this.loading = true;
      let data = {}
      data.afiliado = this.datos.afiliado_id;
      if (this.ocupacional !== undefined) {
        data.afiliado = this.ocupacional[0].afiliado_id
      }
      this.$axios.post("/antecedentes-alergicos/listarAlergiaAmbiental", {
        afiliado: data.afiliado
      })
        .then((res) => {
          this.loading = false;
          this.alergiaAmbiental = res.data;
        })
        .catch((err) => {
          this.loading = false;
          return this.$toast.error("Error al listar antecedentes personales");
        });
    },

    listarAlergiasAlimentos() {
      this.loading = true;
      let data = {}
      data.afiliado = this.datos.afiliado_id;
      if (this.ocupacional !== undefined) {
        data.afiliado = this.ocupacional[0].afiliado_id
      }
      this.$axios.post("/antecedentes-alergicos/listarAlergiaAlimentos", {
        afiliado: data.afiliado
      })
        .then((res) => {
          this.loading = false;
          this.alergiaAlimento = res.data;
        })
        .catch((err) => {
          this.loading = false;
          return this.$toast.error("Error al listar antecedentes personales");
        });

    },

    listarOtras() {
      this.loading = true;
      let data = {}
      data.afiliado = this.datos.afiliado_id;
      if (this.ocupacional !== undefined) {
        data.afiliado = this.ocupacional[0].afiliado_id
      }
      this.$axios.post("/antecedentes-alergicos/listarOtras", {
        afiliado: data.afiliado
      })
        .then((res) => {
          this.loading = false;
          this.otrasAlergias = res.data;
        })
        .catch((err) => {
          this.loading = false;
          return this.$toast.error("Error al listar antecedentes personales");
        });
    },
    eliminarItem(item) {
      return this.$swal({
        title: '¿Estás seguro?',
        text: "¡No podrás revertir esto!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminarlo!',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.value) {
          this.$axios.delete(`antecedentes-alergicos/eliminarAlergia/${item.id}`)
            .then(() => {
              this.$toast.success('Eliminado con éxito');
              this.listarAlergiasMedicamento();
              this.listarAlergiasAlimentos();
              this.listarOtras();
            })
            .catch((error) => {
              this.$toast.error('Error al eliminar: ' + error.response.data.Error);
            });
        }
      });
    },
  }
}
</script>