<template>
  <div>
    <v-form>
      <v-col cols="12" sm="12" md="12">
        <v-container fluid>
          <v-row dense>
            <v-col xs="12" sm="12" md="12">
              <v-alert class="text-center" dense text border="left" type="info" icon="mdi-shield-account-variant">
                <b>PLAN DE CUIDADO</b></v-alert>
            </v-col>
            <v-col xs="12" sm="5" md="5">
              <v-autocomplete label="Seleccione plan de cuidado" :items="planes" return-object item-text="nombre" v-model="planesdeCuidado.plan"></v-autocomplete>
            </v-col>
            <v-col xs="12" sm="5" md="5">
              <v-autocomplete v-model="planesdeCuidado.rep_id"  :items="opcionesRep"
                              item-text="nombre" item-value="id" label="Prestador *"
              ></v-autocomplete>
            </v-col>
            <v-col xs="12" sm="6" md="1">
              <v-btn fab dark small color="success" @click="guardarDatosPlanCuidado(1)">
                <v-icon dark>mdi-plus</v-icon>
              </v-btn>
            </v-col>
            <v-col xs="12" sm="12" md="12">
              <v-data-table :headers="headerPlanCuidado" :items="fetchPlanCuidados">
                <template v-slot:item.index="{ item,index }">
                  {{index+1}}
                </template>
                <template v-slot:item.accion="{ item,index }">
                  <v-btn fab dark x-small color="error" @click="eliminarRegistro(1,index,item.id)">
                    <v-icon dark>mdi-minus</v-icon>
                  </v-btn>
                </template>
              </v-data-table>
            </v-col>

            <v-col xs="12" sm="12" md="12">
              <v-alert class="text-center" dense text border="left" type="info" icon="mdi-page-next-outline">
                <b>PROXIMO CONTROL</b></v-alert>
              <v-col xs="12" sm="6" md="4">
                <v-autocomplete  label="Ingresa la información del próximo control" :items="['1 MES', '2 MESES', '3 MESES', '6 MESES', '1 AÑO']" v-model="proximo.proximo_control">
                </v-autocomplete>
              </v-col>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-form>
  </div>
</template>
<script>
import {mapActions} from "vuex";

export default {
  name: "",
  props: {
    datos: Object,
    ocupacional: Array,
    resumen:Object
  },
  data() {
    return {
      opcionesRep:[],
      planes:[],
      row: null,
      planCuidado: [
        'Atención en salud bucal por profesional de odontología. ',
        'Desparasitación intestinal',
        'Ordenar prueba de hemoglobina',
        'Ordenar prueba de hemoglobina y hematocrito',
        'Vacunación',
        'Consulta de anticoncepción',
        'Tamizaje para enfermedades de trasmisión sexual',
        'Tamizajes para población con identificación de riesgos',
        'Educación grupal para la salud que incluye a la familia',
        'Requiere consulta de control por nutrición si riesgo', 'Inconvenientes e inquietudes sobre la lactancia',
        'Planes de la madre para continuar con la lactancia durante el retorno al trabajo o estudios'
      ],
      siNo: ['Si', 'No'],
      siNoAplica: ['Si', 'No', 'No Aplica'],
      planesdeCuidado: {
        plan: null,
        tipo: null,
        rep_id:null,
      },
      proximo: {
        proximo_control: '',
      },
      salud: ['Prácticas de crianza protectoras', 'Prácticas basadas en derecho', 'Prevención de violencias',
        'Promoción de la salud', 'Manipulación de alimentos y enfermedades trasmisibles por los mismos',
        'Promoción hábitos y estilos de vida', 'Educación de lactancia materna',
        'Hábitos de higiene personal y cuidado bucal', 'Conductas protectoras para audición segura',
        'Evitación del Sedentarismo y uso prolongado de medios audiovisuales', 'Promoción salud mental',
        'Prevención de accidentes', 'Signos de alarma enfermedades prevalentes en el ciclo vital',
        'Educación para consultar por urgencias',
        'Educación derechos de salud y mecanismos de exigibilidad de los mismos',
        'Derechos de las madres', 'Promoción fortalecimiento rol del padre como cuidador de sus hijos',
        'Se orienta sobre el consumo de fuentes de Vitamina A como',
        'Se identifica riesgo deficiencia en Vitamina D y Calcio',
        'Autocuidado', 'Buen relacionamiento con la familia, otras personas y niños',
        'Actividades para estimular el desarrollo',
        'Adherencia a medicamentos y habitos de Vida Saludables',
        'Adecuada expresion de cariño y reconocimiento al niño',
        'Grupal para la salud que incluye a la familia',
        'Sobre el derecho a la IVE. Sentencia C355', 'Prevencion de  VIH', 'Prueba Post VIH',
        'en Anticoncepcion',
        'Método elegido para iniciar en el posparto', 'Sobrecarga del cuidador y tips para evitarlo',
        'Orientación a la madre o cuidador en expedición registro civil del menor',
        'Meta ganancia o perdida de peso',
        'a la madre o cuidador en expedición registro civil del menor',
        'Prevencion del Sedentarismo y uso prolongado de medios audiovisuales',
        'Prevencion de la exposición a hábitos tóxicos',
        'Avances compromisos de sesiones de educación',
        'Recomendaciones al cuidador',
        'Se orienta sobre el consumo de fuentes de Vitamina A',
        'Se identifica riesgo deficiencia en Vitamina D y Calcio'
      ],
      crianza: [
        'Se le expresa cariño y reconocimiento al niño',
        'Indagación sobre acciones correctivas',
        'Actividades para estimular el desarrollo',
        'Buen relacionamiento con la familia, otras personas y niños',
        'Educación en autocuidado'
      ],
      fetchPlanCuidados: [],
      headerPlanCuidado: [
        {
          text: 'Plan y Cuidado',
          align: 'center',
          value: 'plan'
        },
        {
          text: '',
          value: 'accion'
        }
      ],
      headerCrianzaCuidado: [{
        text: 'id',
        value:'index'
      },
        {
          text: 'Practica Crianza',
          value: 'pratica'
        },
        {
          text: 'Si / No',
          value: 'tipo'
        },
        {
          text: '',
          value: 'accion'
        }

      ],
      headerInforSalud: [{
        text: 'id',
        value:'index'
      },
        {
          text: 'Informacion salud',
          value: 'informacion'
        },
        {
          text: 'Si / No',
          value: 'tipo'
        },
        {
          text: '',
          value: 'accion'
        }
      ],
      evaluacionPlan: {
        evaluacion: '',
        tipo_evaluacion: '',
      },
      inforSalud: {
        informacion: null,
        tipo: null
      },
      practicasCrianza: {
        practica: null,
        tipo: null
      },
      allInforSalud: [],
      allCrianzaCuidado: []
    }
  },
  created() {
    this.proximo = this.resumen;
    this.listarPlanCuidados();
    this.listarPrestadores();
    this.listaPlanCuidadoAfiliado();
  },
  methods: {
    ...mapActions("app", ["setPreload"]),

    listaPlanCuidadoAfiliado() {
      let data = {}
      data.afiliado = this.datos.afiliado_id;
      if (this.ocupacional !== undefined) {
        data.afiliado = this.ocupacional[0].afiliado_id
      }
      this.$axios.post(`historia/plan-cuidado`, {afiliado: data.afiliado})
        .then(res => {
          this.fetchPlanCuidados = res.data.PlanCuidado;

        });
    },
    listarPlanCuidados(){
      this.setPreload(true);
      this.$axios.get("plan-cuidado/listar").then(res => {
        this.planes = res.data
      }).catch((e) => console.log(e.response)).finally( () => this.setPreload(false))
    },
    guardarDatosPlanCuidado() {
      if(!this.planesdeCuidado.plan){
        return this.$toast.error('El campo "plan de cuidado" es requerido.');
      }
      if(!this.planesdeCuidado.rep_id){
        return this.$toast.error('El campo "prestador" es requerido.');
      }
      this.$swal({
        title: "Está seguro?",
        text: "Agregar un plan de cuidado genera una orden automaticamente",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#28a745",
        cancelButtonColor: "#d33",
        confirmButtonText: "Aceptar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.value) {
          this.$axios.post('historia/guardar-plan-cuidado/' + this.datos.id, this.planesdeCuidado).then(res => {
            this.listarPlanCuidados();
            this.limpiarData();
          }).catch((e) => console.log(e.response)).finally( () => this.setPreload(false))
        }else{
          this.limpiarData();
        }
      });
    },
    eliminarRegistro(tipo, index, id) {
      switch (tipo) {
        case 1:
          this.fetchPlanCuidados.splice(index, 1);
          break;
        case 2:
          this.allInforSalud.splice(index, 1);
          break;
        case 3:
          this.allCrianzaCuidado.splice(index, 1);
          break
      }
      this.$axios.$delete('historia/eliminar-registro-plan-cuidado/' + tipo + '/' + id).then(res => {
        this.listarPlanCuidados();
      })
    },
    limpiarData() {
      for (const prop of Object.getOwnPropertyNames(this.planesdeCuidado)) {
        this.planesdeCuidado[prop] = null;
      }
    },
    listarPrestadores() {
      this.setPreload(true);
      this.$axios.post(`reps/listarFarmaciasSumi`).then((res) => {
        this.opcionesRep = res.data.map((rep) => {
          return {
            id: rep.id,
            nombre: `${rep.prestadores.nit} - ${rep.nombre} - (${rep.municipio.nombre})`,
          };
        });
      })
        .catch((e) => {
          this.$toast.error("Ocurrió un error al listar los prestadores");
        })
        .finally(() => {
          this.setPreload(false)
        });
    },
    validarErrores() {
      return [];
    }
  }

}

</script>
