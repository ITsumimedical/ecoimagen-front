<template>
  <div>
    <v-dialog v-model="dialogDetalle" width="1200" persistent>
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          Detalle Plan de Cuidado
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-text-field v-model="formPlan.nombre" label="Nombre" required></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="8">
                <v-text-field v-model="formPlan.descripcion" label="Descripcion" required></v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="12">
                <v-divider></v-divider>
              </v-col>
            </v-row>
            <v-row dense>
              <v-col cols="12" sm="12" md="12">
                <v-form ref="formularioOrdenarMedicamento" class="mt-3">
                  <v-row dense>
                    <v-col cols="12" sm="12" md="8">
                      <v-autocomplete dense v-model="formOrdenar.articulo" :loading="loading.busquedaArticulo"
                                      :items="opcionesArticulos" item-text="codesumi.nombre" return-object
                                      :search-input.sync="campoBusquedaArticulo" label="Medicamento *"
                                      no-data-text="Escriba el nombre del medicamento para iniciar la búsqueda"
                                      hint="Escriba el nombre del medicamento para iniciar la búsqueda"
                                      :rules="rules.obligatorio">
                      </v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="12" md="2">
                      <v-autocomplete v-model="formOrdenar.presentacion" :items="opcionesPresentacion" label="Presentación *"
                                      dense :rules="rules.obligatorio"></v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="12" md="2">
                      <v-autocomplete v-model="formOrdenar.via" :items="opcionesVia" label="Vía *" dense
                                      :rules="rules.obligatorio"></v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="12" md="3">
                      <v-text-field v-model="formOrdenar.dosis" label="Dosis *" dense type="number" :rules="rules.noNegativo">
                      </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12" md="2">
                      <v-text-field v-model="formOrdenar.frecuencia" label="Frecuencia *" dense type="number"
                                    :rules="rules.noNegativo"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12" md="3">
                      <v-select dense v-model="formOrdenar.unidad_tiempo" label="Unidad de Tiempo *" :items="['Horas', 'Días']"
                                :rules="rules.obligatorio"></v-select>
                    </v-col>
                    <v-col cols="12" sm="12" md="2">
                      <v-text-field dense v-model="formOrdenar.duracion" label="Duración (Días al mes) *" type="number"
                                    :rules="rules.noNegativo"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12" md="2">
                      <v-select dense v-model="formOrdenar.meses" label="Número de Meses *" :items="[1, 2, 3, 4, 5, 6]"
                                :rules="rules.obligatorio"></v-select>
                    </v-col>
                    <v-col cols="12" sm="12" md="2">
                      <v-text-field dense v-model="cantidadMensual" outlined label="Cantidad Mensual" type="number" readonly>
                      </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12" md="5">
                      <v-text-field v-model="formOrdenar.cantidad_medico" label="Cantidad Mensual Médico *" type="number" dense
                                    :rules="rules.noNegativo">
                      </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                      <v-textarea outlined auto-grow v-model="formOrdenar.observacion" label="Observación *"
                                  :rules="rules.observacion"></v-textarea>
                    </v-col>
                    <v-col cols="12" sm="12" md="12" class="text-right">
                      <v-btn :disabled="loading.agregarArticulo" color="primary" small @click="agregarArticulo()">Agregar
                      </v-btn>
                      <v-btn :disabled="loading.agregarArticulo" color="warning" small @click="limpiarFormulario()">Limpiar
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-form>
              </v-col>
            </v-row>
            <v-col cols="12" sm="12" md="12">
              <v-divider></v-divider>
            </v-col>
            <v-col cols="12" sm="12" md="12">
              <v-data-table :headers="headersPreOrden" :items="medicamentosSeleccionados"
                            no-data-text="Agregue medicamentos para visualizarlos aquí" :loading="loading.agregarArticulo"
                            loading-text="Agregando... Por favor espere" disable-pagination hide-default-footer>
                <template v-slot:[`item.descripcion`]="{ item }">
                  <td>{{ item | descripcion }}</td>
                </template>
                <template v-slot:[`item.autorizacion`]="{ item }">
                  <v-chip small dark :color="item.articulo.codesumi.requiere_autorizacion? 'error': 'primary'">
                    {{ item.articulo.codesumi.requiere_autorizacion ? "Si" : "No" }}
                  </v-chip>
                </template>
                <template v-slot:[`item.acciones`]="{ index }">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon color="error" v-bind="attrs" v-on="on" @click="medicamentosSeleccionados.splice(index, 1)">
                        mdi-close-circle
                      </v-icon>
                    </template>
                    <span>Eliminar de la Selección</span>
                  </v-tooltip>
                </template>
              </v-data-table>
            </v-col>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="success" @click="guardarPlanCuidado(detalleSeleccionado.id)">Actualizar</v-btn>
          <v-btn color="error" @click="cerrarDialog">Cerrar</v-btn>
        </v-card-actions>




      </v-card>
    </v-dialog>
    <v-dialog v-model="dialog" width="1200" persistent>
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          Nuevo Plan de Cuidado
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-text-field v-model="formPlan.nombre" label="Nombre" required></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="8">
                <v-text-field v-model="formPlan.descripcion" label="Descripcion" required></v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="12">
              <v-divider></v-divider>
              </v-col>
            </v-row>
            <v-row dense>
              <v-col cols="12" sm="12" md="12">
             <v-form ref="formularioOrdenarMedicamento" class="mt-3">
              <v-row dense>
              <v-col cols="12" sm="12" md="8">
                <v-autocomplete dense v-model="formOrdenar.articulo" :loading="loading.busquedaArticulo"
                                :items="opcionesArticulos" item-text="codesumi.nombre" return-object
                                :search-input.sync="campoBusquedaArticulo" label="Medicamento *"
                                no-data-text="Escriba el nombre del medicamento para iniciar la búsqueda"
                                hint="Escriba el nombre del medicamento para iniciar la búsqueda"
                                :rules="rules.obligatorio">
                </v-autocomplete>
              </v-col>
              <v-col cols="12" sm="12" md="2">
                <v-autocomplete v-model="formOrdenar.presentacion" :items="opcionesPresentacion" label="Presentación *"
                                dense :rules="rules.obligatorio"></v-autocomplete>
              </v-col>
              <v-col cols="12" sm="12" md="2">
                <v-autocomplete v-model="formOrdenar.via" :items="opcionesVia" label="Vía *" dense
                                :rules="rules.obligatorio"></v-autocomplete>
              </v-col>
              <v-col cols="12" sm="12" md="3">
                <v-text-field v-model="formOrdenar.dosis" label="Dosis *" dense type="number" :rules="rules.noNegativo">
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="2">
                <v-text-field v-model="formOrdenar.frecuencia" label="Frecuencia *" dense type="number"
                              :rules="rules.noNegativo"></v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="3">
                <v-select dense v-model="formOrdenar.unidad_tiempo" label="Unidad de Tiempo *" :items="['Horas', 'Días']"
                          :rules="rules.obligatorio"></v-select>
              </v-col>
              <v-col cols="12" sm="12" md="2">
                <v-text-field dense v-model="formOrdenar.duracion" label="Duración (Días al mes) *" type="number"
                              :rules="rules.noNegativo"></v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="2">
                <v-select dense v-model="formOrdenar.meses" label="Número de Meses *" :items="[1, 2, 3, 4, 5, 6]"
                          :rules="rules.obligatorio"></v-select>
              </v-col>
              <v-col cols="12" sm="12" md="2">
                <v-text-field dense v-model="cantidadMensual" outlined label="Cantidad Mensual" type="number" readonly>
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="5">
                <v-text-field v-model="formOrdenar.cantidad_medico" label="Cantidad Mensual Médico *" type="number" dense
                              :rules="rules.noNegativo">
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="12">
                <v-textarea outlined auto-grow v-model="formOrdenar.observacion" label="Observación *"
                            :rules="rules.observacion"></v-textarea>
              </v-col>
              <v-col cols="12" sm="12" md="12" class="text-right">
                <v-btn :disabled="loading.agregarArticulo" color="primary" small @click="agregarArticulo()">Agregar
                </v-btn>
                <v-btn :disabled="loading.agregarArticulo" color="warning" small @click="limpiarFormulario()">Limpiar
                </v-btn>
              </v-col>
              </v-row>
              </v-form>
              </v-col>
            </v-row>
              <v-col cols="12" sm="12" md="12">
                <v-divider></v-divider>
              </v-col>
              <v-col cols="12" sm="12" md="12">
                <v-data-table :headers="headersPreOrden" :items="medicamentosSeleccionados"
                              no-data-text="Agregue medicamentos para visualizarlos aquí" :loading="loading.agregarArticulo"
                              loading-text="Agregando... Por favor espere" disable-pagination hide-default-footer>
                  <template v-slot:[`item.descripcion`]="{ item }">
                    <td>{{ item | descripcion }}</td>
                  </template>
                  <template v-slot:[`item.autorizacion`]="{ item }">
                    <v-chip small dark :color="item.articulo.codesumi.requiere_autorizacion? 'error': 'primary'">
                      {{ item.articulo.codesumi.requiere_autorizacion ? "Si" : "No" }}
                    </v-chip>
                  </template>
                  <template v-slot:[`item.acciones`]="{ index }">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon color="error" v-bind="attrs" v-on="on" @click="medicamentosSeleccionados.splice(index, 1)">
                          mdi-close-circle
                        </v-icon>
                      </template>
                      <span>Eliminar de la Selección</span>
                    </v-tooltip>
                  </template>
                </v-data-table>
              </v-col>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="success" @click="guardarPlanCuidado()">Guardar</v-btn>
          <v-btn color="error" @click="cerrarDialog">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-data-table dense :headers="headers" :search="buscar" :items="planes" no-data-text="Sin datos para mostrar"
                  class="elevation-1" :loading="loading.tabla" loading-text="Cargando...">
      <template v-slot:top>
        <v-card-title>
          <v-btn small color="boton" class="mb-2 white--text" @click="dialog = true">
            Nuevo
            <v-icon>
              mdi-plus-circle-outline
            </v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-text-field v-model="buscar" label="Buscar" append-icon="mdi-magnify" hide-details single-line>
          </v-text-field>
        </v-card-title>
      </template>
      <template v-slot:item.accion="{ item }">
        <td>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
          <v-btn v-on="on" color="primary" icon @click="cargarDetallePlan(item)"><v-icon>mdi-eye</v-icon></v-btn>
            </template>
            <span>Detalles</span>
          </v-tooltip>
        </td>
      </template>
    </v-data-table>
  </div>
</template>
<script>
import {mapActions} from "vuex";

export default {
  name: "PlanCuidado",
  data() {
    return {
      detalleSeleccionado:null,
      dialogDetalle:false,
      formPlan:{
        nombre:null,
        descripcion:null,
      },
      medicamentosSeleccionados: [],
      dialog:false,
      buscar:'',
      loading: {
        busquedaArticulo: false,
        tabla:false
      },
      opcionesRep: [],
      planes:[],
      headers:[
        {text:'Nombre',align: 'center',value:'nombre'},
        {text:'Descripcion',align: 'center',value:'descripcion'},
        {text:'',align: 'center',value:'accion'},
      ],
      opcionesPresentacion: [
        "Ampolla",
        "Aplicaciones",
        "Bolsa",
        "Capsula",
        "Comprimido",
        "Gotas",
        "Implante",
        "Inhalaciones",
        "Litro",
        "Mililitros",
        "Parche",
        "Sobre",
        "Supositorio",
        "Tableta",
        "Unidades",
        "Unidad Internacional",
        "Vial",
      ],
      opcionesVia: [
        "Oral",
        "Intramuscular",
        "Intravenosa",
        "Subcutánea",
        "Sublingual",
        "Inhalatoria",
        "Transdérmica",
        "Dérmica",
        "Nasal",
        "Oftálmica",
        "Ótica",
        "Tópica",
        "Rectal",
        "Vaginal",
        "Enjuague",
        "Intratectual",
        "Enteral",
      ],
      opcionesArticulos: [],
      formOrdenar: {
        articulo: null,
        presentacion: "",
        via: "",
        dosis: "",
        frecuencia: "",
        unidad_tiempo: "",
        duracion: "",
        meses: "",
        cantidad_medico: "",
        observacion: "",
        descripcion: "",
        alertaDetalleId: null,
        fechaVigencia: new Date(
          Date.now() - new Date().getTimezoneOffset() * 60000
        )
          .toISOString()
          .substring(0, 10),
      },
      campoBusquedaArticulo: null,
      rules: {
        obligatorio: [(v) => !!v || "Este campo es requerido"]
      },
      headersPreOrden: [{
        text: "Medicamento",
        value: "codesumi.nombre"
      },
        {
          text: "Descripción",
          value: "descripcion"
        },
        {
          text: "Cantidad Mensual",
          value: "cantidad_medico",
          align: "center"
        },
        {
          text: "N° Meses",
          value: "meses",
          align: "center"
        },
        {
          text: "Observación",
          value: "observacion"
        },
        {
          text: "Acciones",
          value: "acciones",
          align: "center",
          sortable: false,
        },
      ],
    }
  },
  filters: {
    descripcion: (item) => {
      if (item.unidad_tiempo == "Horas")
        return `${item.dosis} ${item.presentacion} ${item.via} cada ${item.frecuencia} Horas por ${item.duracion} días`;
      else
        return `${item.dosis} ${item.presentacion} ${item.via} cada ${item.frecuencia} Días por ${item.duracion} días`;
    },
  },
  computed: {
    cantidadMensual() {
      let cantidad = 0;
      if (this.formOrdenar.unidad_tiempo == "Horas") {
        cantidad = Math.round(
          (24 / this.formOrdenar.frecuencia) *
          this.formOrdenar.dosis *
          this.formOrdenar.duracion
        );
      } else {
        cantidad = Math.round(
          (this.formOrdenar.duracion / this.formOrdenar.frecuencia) *
          this.formOrdenar.dosis
        );
      }

      return cantidad || 0;
    },
  },
  watch: {
    campoBusquedaArticulo(newValue) {
      if (newValue && newValue.length === 4) {
        this.buscarMedicamento();
      }
    },
  },
  mounted() {
    this.listarPlanCuidados();
  },
  methods: {
    ...mapActions("app", ["setPreload"]),
    buscarMedicamento() {
      this.loading.busquedaArticulo = true;
      this.setPreload(true);
      this.$axios
        .post("medicamentos/listarMedicamentoOrdenamiento", {
          nombre: this.campoBusquedaArticulo,
        })
        .then((res) => {
          this.opcionesArticulos = res.data;
        })
        .catch((e) => {
          this.$toast.error("Ocurrió un error al listar los medicamentos");
        })
        .finally(() => {
          this.loading.busquedaArticulo = false;
          this.setPreload(false);
        });
    },
    async agregarArticulo() {
      let data = {};
      for (const val in this.formOrdenar) {
        console.log(val)
        if(val === 'articulo'){
          data.codesumi = this.formOrdenar.articulo.codesumi;
        }else{
          data[val] = this.formOrdenar[val];
        }
      }
      this.medicamentosSeleccionados.push(data);
      this.$toast.success("Medicamento agregado correctamente");
      this.limpiarFormulario();
    },
    limpiarFormulario() {
      this.formOrdenar = {
        articulo: null,
        presentacion: "",
        via: "",
        dosis: "",
        frecuencia: "",
        unidad_tiempo: "",
        duracion: "",
        meses: "",
        cantidadMedico: "",
        rep_id: null,
        observacion: "",
        descripcion: "",
        fechaVigencia: new Date(
          Date.now() - new Date().getTimezoneOffset() * 60000
        )
          .toISOString()
          .substring(0, 10),
      };
      this.$refs.formularioOrdenarMedicamento.resetValidation();
    },
    guardarPlanCuidado(id = 0){
      if(!this.formPlan.nombre){
        return this.$toast.error('El campo "Nombre" es requerido');
      }
      if(!this.formPlan.descripcion){
        return this.$toast.error('El campo "Descripcion" es requerido');
      }
      if(this.medicamentosSeleccionados.length === 0){
        return this.$toast.error('Se requiere minimo un medicamento asociado al plan de cuidado');
      }
      this.setPreload(true);
      this.$axios.post("plan-cuidado/crear/"+id, {plan:this.formPlan,articulos:this.medicamentosSeleccionados}).then(res => {
        this.dialog = false;
        this.cerrarDialog();
        this.medicamentosSeleccionados = [];
        this.formPlan.nombre = null;
        this.formPlan.descripcion = null;
        this.listarPlanCuidados();
      }).catch((e) => console.log(e.response)).finally( () => this.setPreload(false))
    },
    listarPlanCuidados(){
      this.setPreload(true);
      this.$axios.get("plan-cuidado/listar").then(res => {
        this.planes = res.data
      }).catch((e) => console.log(e.response)).finally( () => this.setPreload(false))
    },
    cargarDetallePlan(item){
      this.detalleSeleccionado = item;
      this.formPlan.descripcion = item.descripcion;
      this.formPlan.nombre = item.nombre;
      this.medicamentosSeleccionados = item.articulos;
      this.dialogDetalle = true;
    },
    actualizarPlanCuidado(){

    },
    cerrarDialog(){
      this.dialog = false;
      this.dialogDetalle = false;
      this.limpiarFormulario();
      this.medicamentosSeleccionados = [];
    }
  },
}
</script>
