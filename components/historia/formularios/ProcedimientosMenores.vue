<template>
  <div>
    <template>
      <div class="text-center">
        <v-dialog v-model="preload" persistent width="300">
          <v-card color="primary" dark>
            <v-card-text>
              Tranquilo procesamos tu solicitud!
              <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
            </v-card-text>
          </v-card>
        </v-dialog>
      </div>
    </template>
    <v-form ref="insumosMedicamentos" lazy-validation>
      <v-row >
        <v-col xs="12" sm="12" md="12" v-if="!([33].includes(datos.cita.tipo_historia_id))">
          <v-alert border="left" class="text-center"  dense text outlined type="info" icon="mdi-progress-check">
            <b>PROCEDIMIENTOS MENORES</b></v-alert>
        </v-col>
        <v-col cols="12" sm="12" md="12" v-if="!([33].includes(datos.cita.tipo_historia_id))">
          <v-autocomplete dense outlined v-model="menor.cup_id" :search-input.sync="FiltroCups" :items="cups"
            item-text="cups" no-data-text="Debe ingresar el nombre del procedimiento" item-value="id"
            label="Digita el nombre de procedimiento" :rules="rules">
          </v-autocomplete>
        </v-col>
        <v-col cols="12" sm="12" md="12" v-if="!([33].includes(datos.cita.tipo_historia_id))">
          <v-textarea dense outlined v-model="menor.procedimiento_menor" label=" Descripción procedimiento menor"
            hint="Escriba una descripción parael procedimiento procedimiento" auto-grow :rules="rules">
          </v-textarea>
        </v-col>
        <v-col>
        </v-col>
        <v-col xs="12" sm="12" md="12">
          <v-alert border="left" class="text-center" dense text outlined type="info" icon="mdi-pill">
            <b>INSUMOS Y MEDICAMENTOS</b></v-alert>
        </v-col>
        <v-col cols="12" sm="12" md="6">
          <v-autocomplete dense outlined :search-input.sync="FiltroCodesumis" :items="codesumis" item-text="nombre"
            item-value="id" no-data-text="Debe ingresar el nombre del insumo o medicamento"
            label="Insumos o medicamentos" v-model="procedimiento.codesumi_id">
          </v-autocomplete>
        </v-col>
        <v-col md="3">
          <v-text-field type="number" label="Cantidad" v-model="procedimiento.cantidad" dense outlined>
          </v-text-field>
        </v-col>
        <v-col cols="12" sm="1" md="1">
          <v-tooltip bottom dense>
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" color="success" text fab small dark @click="agregarInsumo()">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </template>
            <span>Agregar insumo o medicamento</span>
          </v-tooltip>
        </v-col>
        <v-col>
          <v-data-table :headers="Headersprocedimientos" :items="procedimientos" class="elevation-1">
            <template v-slot:[`item.actions`]="{ item }">
              <td>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn @click="inahabilitarInsumo(item.id)" color="red" icon small v-on="on">
                      <v-icon>mdi-delete-alert-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>Eliminar insumo</span>
                </v-tooltip>
              </td>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

  export default {
    props: ['datos', 'resumen'],
    data() {
      return {
        cups: [],
        FiltroCups: null,
        preload: false,
        codesumis: [],
        procedimientos: [],
        FiltroCodesumis: null,
        menor: {},
        procedimiento: {
          codesumi_id: '',
          cantidad: ''
        },
        Headersprocedimientos: [{
            text: 'Medicamento',
            value: 'codesumis'
          },
          {
            text: 'Cantidad',
            value: 'cantidad'
          },
          {
            text: 'Acciones',
            value: 'actions'
          }
        ],
        rules: [
          v => !!v || 'Este campo es requerido',
        ],
      }
    },
    watch: {
      FiltroCups(val) {
        if (val) {
          if (val.length === 4) {
            this.listaCups();
          } else if (val.length < 4) {
            this.cups = null;
          }
        } else {
          this.cups = null;
        }
      },
      FiltroCodesumis(val) {
        if (val) {
          if (val.length === 4) {
            this.listarCodesumis();
          } else if (val.length < 4) {
            this.codesumis = null;
          }
        } else {
          this.codesumis = null;
        }
      }
    },
    computed: {
        ...mapGetters('historiaClinica', ['obtenerDatosPorConsulta']),
    },
    created() {
      this.insumosCargados();
        const datosProcedimientoMenor = this.obtenerDatosPorConsulta(this.datos.id, 'Historia/Models/HistoriaClinica', 'historia/formularios/ProcedimientosMenores');

            if (datosProcedimientoMenor) {
                this.menor = {...datosProcedimientoMenor}
            }
    },
    methods: {

        obtenerDatos() {
            return { datos: this.menor };
        },
      validarErrores() {
        return [];
      },
      listaCups() {
        this.preload = true;
        this.$axios.post('/cup/buscarCupsNombre', {
          nombre: this.FiltroCups,
          idAfiliado: this.datos.afiliado.id
        }).then(res => {
          this.cups = res.data;
          this.preload = false;
        }).catch(e => {
          console.error(e.response);
          this.preload = false;
        });
      },
      listarCodesumis() {
        this.preload = true;
        this.$axios.post('/codesumis/buscar', {
          nombre: this.FiltroCodesumis
        }).then(res => {
          this.codesumis = res.data;
          this.preload = false;
        }).catch(e => {
          console.error(e.response);
          this.preload = false;
        });
      },

      agregarInsumo() {
        let data = {
          consulta_id: this.datos.id,
          codesumi_id: this.procedimiento.codesumi_id,
          cantidad: this.procedimiento.cantidad
        };
        this.preload = true;
        this.$axios.post('/insumos/crear', data)
          .then(response => {
            this.insumosCargados()
            this.limpiar()
            console.log('Insumo agregado con éxito', response.data);
            this.$toast.success('Insumos agregado con éxito')
            this.preload = false;
          })
          .catch(error => {
            console.error('Error al agregar insumo', error.response);
            this.preload = false;
          });
      },

      limpiarCampos() {
        this.menor = {
          cup_id: '',
          procedimiento_menor: ''
        }
      },

      insumosCargados() {
        this.preload = true;
        this.$axios.get('/insumos/listarInsumos/' + this.datos.id)
          .then(res => {
            this.procedimientos = res.data;
            this.preload = false;
          });
      },
      inahabilitarInsumo(id) {
        this.preload = true;
        this.$axios.delete(`/insumos/eliminarInsumo/${id}`)
          .then(res => {
            this.insumosCargados();
            this.$toast.success('Insumo eliminado con éxito');
            this.preload = false;
          })
          .catch(error => {});
      },

      limpiar() {
        this.procedimiento = {
          codesumi_id: '',
          cantidad: ''
        }
      },

      validarErrores() {
        return this.$refs.insumosMedicamentos.validate();
      }

    }
  }

</script>
