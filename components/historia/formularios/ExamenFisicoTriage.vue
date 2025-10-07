<template>
  <div>
    <v-form ref="ExamenFisicoTriage" lazy-validation>
      <v-col cols="12" sm="12" md="12">
        <template v-if="![43,45, 58, 107].includes(this.datos.cita.especialidade_id)">
          <v-alert class="text-center" dense text border="left" type="info" icon="mdi-ruler">
            <b>MEDIDAS ANTROPOMETRICAS</b></v-alert>
          <v-row dense>
            <v-col xs="12" sm="6" md="1">
              <v-text-field label="Peso (Kg)" v-model="examenF.peso" type="number" min="1" max="300"
                :rules="[v => (this.datos.cita.especialidade_id != 41 && this.datos.cita.especialidade_id != 45  && this.datos.cita.especialidade_id != 43 && this.datos.cita.especialidade_id != 42 && this.datos.cita.especialidade_id != 41  && this.datos.cita.especialidade_id != 40  && this.datos.cita.especialidade_id != 39 && this.datos.cita.tipo_historia_id != 15)? (v >= 1 && v <= 300) || 'Valor fuera del rango permitido (1 - 300)': []]">
              </v-text-field>
            </v-col>
            <v-col xs="12" sm="6" md="2">
              <v-text-field label="Talla (Cm)" v-model="examenF.talla" type="number"
                :rules="[v => (this.datos.cita.especialidade_id != 41 && this.datos.cita.especialidade_id != 45  && this.datos.cita.especialidade_id != 43 && this.datos.cita.especialidade_id != 42 && this.datos.cita.especialidade_id != 41  && this.datos.cita.especialidade_id != 40  && this.datos.cita.especialidade_id != 39 && this.datos.cita.tipo_historia_id != 15)? (v >= 1 && v <= 300) || 'Valor fuera del rango permitido (1 - 300)': []]">
              </v-text-field>
            </v-col>
            <v-col xs="12" sm="6" md="2">
              <v-text-field label="Indice de Masa Corporal" v-model="examenF.imc" type="number" readonly>
              </v-text-field>
            </v-col>
            <v-col xs="12" sm="6" md="2">
              <v-text-field label="ASC" v-model="examenF.isc" type="number" readonly>
              </v-text-field>
            </v-col>
            <v-col xs="12" sm="6" md="3">
              <v-text-field label="Clasificación" v-model="examenF.clasificacion" readonly>
              </v-text-field>
            </v-col>
            <v-col xs="12" sm="6" md="2">
              <v-text-field label="Perímetro Abdominal" type="number" v-model="examenF.perimetro_abdominal"
                :rules="[v => (
                    this.datos.cita.tipo_historia_id == 12 || this.datos.cita.tipo_historia_id == 13)? (v >= 1 && v <= 300) || 'Valor fuera del rango permitido (1 - 300)': []]">
              </v-text-field>
            </v-col>
          </v-row>
        </template>

        <v-divider></v-divider>

        <!-- <v-col cols="12" sm="6" md="6">
          <graficas :datos="datos"></graficas>
        </v-col> -->

        <template v-if="![42,43, 44, 45, 58,41, 107].includes(this.datos.cita.especialidade_id)">
          <v-alert class="text-center" dense text border="left" type="info" icon="mdi-clipboard-pulse">
            <b>SIGNOS VITALES</b></v-alert>

          <v-row dense v-show="datos.cita.especialidad.nombre !== 'Quimica Farmacologica'">
            <v-col xs="12" sm="6" md="3">
              <v-text-field label="Sistólica" dense type="number" v-model="examenF.presion_sistolica"
                :rules="[v => (this.datos.afiliado.edad_cumplida > 3 && this.datos.cita.especialidade_id != 45 && this.datos.cita.especialidade_id != 44 && this.datos.cita.especialidade_id != 43 && this.datos.cita.especialidade_id != 42 && this.datos.cita.tipo_historia_id != 15)? (v >= 10 && v <= 300) || 'Valor fuera del rango permitido (10 - 300)': []]">
              </v-text-field>
            </v-col>
            <v-col xs="12" sm="6" md="2">
              <v-text-field label="Diastólica" dense type="number" v-model="examenF.presion_diastolica"
                :rules="[v =>(this.datos.afiliado.edad_cumplida > 3 && this.datos.cita.especialidade_id != 45 && this.datos.cita.especialidade_id != 44 && this.datos.cita.especialidade_id != 43 && this.datos.cita.especialidade_id != 42 && this.datos.cita.tipo_historia_id != 15) ? (v >= 10 && v <= 150) || 'Valor fuera del rango permitido (10 - 150)': []]">
              </v-text-field>
            </v-col>

            <v-col xs="12" sm="6" md="3">
              <v-text-field dense label="Presión Arterial Media" type="number" v-model="examenF.presion_arterial_media"
                readonly></v-text-field>
            </v-col>
            <v-col xs="12" sm="6" md="3">
              <v-text-field dense label="Frecuencia cardiaca" type="number" v-model="examenF.frecuencia_cardiaca"
                :rules="[ v => (this.datos.cita.especialidade_id != 45 && this.datos.cita.especialidade_id != 44 && this.datos.cita.especialidade_id != 43 && this.datos.cita.especialidade_id != 42 && this.datos.cita.tipo_historia_id != 15) ? (v >= 30 && v <= 300) || 'Valor fuera del rango permitido (30 - 300)' : []]">
              </v-text-field>
            </v-col>

            <v-col xs="12" sm="6" md="1">
              <v-text-field dense label="Pulso" type="number" v-model="examenF.pulsos"></v-text-field>
            </v-col>
            <v-col xs="12" sm="6" md="3">
              <v-text-field dense label="Frecuencia Respiratoria" type="number"
                v-model="examenF.frecuencia_respiratoria"
                :rules="[v => (this.datos.cita.especialidade_id != 45 && this.datos.cita.especialidade_id != 44 && this.datos.cita.especialidade_id != 43 && this.datos.cita.especialidade_id != 42 && this.datos.cita.tipo_historia_id != 15) ? (v > 0 && v < 100) || 'Valor fuera del rango permitido (0 - 100)' : []]">
              </v-text-field>
            </v-col>

            <v-col xs="12" sm="6" md="2">
              <v-text-field dense label="Temperatura" type="number" v-model="examenF.temperatura">
              </v-text-field>
            </v-col>
            <v-col xs="12" sm="6" md="3">
              <v-text-field dense label="Saturación de oxígeno" type="number" v-model="examenF.saturacion_oxigeno"
                :rules="[v =>(this.datos.cita.especialidade_id != 45 && this.datos.cita.especialidade_id != 44 && this.datos.cita.especialidade_id != 43 && this.datos.cita.especialidade_id != 42 && this.datos.cita.tipo_historia_id != 15)? (v > 30 && v < 100) || 'Valor fuera del rango permitido (30 - 100)': []]">
              </v-text-field>
            </v-col>
          </v-row>
        </template>
      </v-col>
    </v-form>
  </div>
</template>
<script>
  import {
    mapState,
    mapActions
  } from 'vuex';


  export default {
    name: "ExamenFisico",

    name: "",
    props: ['datos', 'resumen'],
    created() {
      this.examenF = this.resumen;
    },
    data() {
      return {
        historicoExamen: [],
        Rolcuidador: '',
        cuidador: ['Si', 'No'],
        cuestionarioGAD2: ['Si', 'No'],
        examenF: {
          estado_oido: null,
          piel_anexos: null,
          tamizacion_depresion: null,
          tamizacion_trastornos_ansiedad: null,
          test_audit: null,
          examen_cardiorespiratorio: null,
          tamizaje_auditivo_neonatal: null,
          examen_genitales: null,
          tubos_ven: null,
          sel_ccc: null,
          peso: null,
          talla: null,
          imc: null,
          isc: null,
          clasificacion: null,
          perimetro_abdominal: null,
          perimetro_cefalico: null,
          peso_talla: null,
          clasificacion_peso_talla: null,
          talla_edad: null,
          clasificacion_talla_edad: null,
          cefalico_edad: null,
          clasificacion_cefalico_edad: null,
          imc_edad: null,
          clasificacion_imc_edad: null,
          peso_edad: null,
          clasificacion_peso_edad: null,
          circunferencia_brazo: null,
          circunferencia_pantorrilla: null,
          ganancia_esperada: null,
          posicion: null,
          lateralidad: null,
          presion_sistolica: null,
          presion_diastolica: null,
          presion_arterial_media: null,
          frecuencia_cardiaca: null,
          pulsos: null,
          frecuencia_respiratoria: null,
          temperatura: null,
          saturacion_oxigeno: null,
          fiO: '0.21',
          aspecto_general: null,
          piel_faneras: null,
          cabeza: null,
          cara: null,
          ojos: null,
          visual_nino: null,
          agudeza_visual_ambos: null,
          agudeza_visual_der: null,
          conjuntiva: null,
          esclera: null,
          ojos_fondo_ojos_ant: null,
          ojos_fondo_ojos_post: null,
          nariz: null,
          tabique: null,
          cornetes: null,
          oidos: null,
          problema_oido: null,
          escucha_bien: null,
          auricular_der: null,
          auricular_izq: null,
          conducto_der: null,
          membrana_tim: null,
          integra: null,
          perforacion: null,
          maxilar: null,
          labios_comisura: null,
          mejilla_carrillo: null,
          cavidad_oral: null,
          articulacion_temporo: null,
          estructuras_dentales: null,
          cuello: null,
          pulmones: null,
          cardiacos: null,
          torax: null,
          mamas: null,
          pectorales: null,
          reja_costal: null,
          reja_costal_pos: null,
          desv_col: null,
          abdomen: null,
          altura_uterina: null,
          actividad_uterina: null,
          frecuencia_cardiaca_fetal: null,
          movimientos_fetales: null,
          ruidos_placentarios: null,
          presentacion_fetal: null,
          dorso_fetal: null,
          numero_fetos: null,
          pos_utero: null,
          alteraciones_genitales: null,
          alteraciones_genitales_externos: null,
          tanner_vello: null,
          masculino: null,
          testiculos: null,
          escroto: null,
          prepucio: null,
          cordon: null,
          tacto_rectal_hom: null,
          tanner_masculino: null,
          femenino: null,
          especuloscopia: null,
          tacto_vag: null,
          involucion: null,
          sangrado_uterino: null,
          expul_tapon: null,
          dilatacion_cuello: null,
          borramiento: null,
          estacion: null,
          loquios: null,
          tactorec_fem: null,
          tanner_femenino: null,
          desgarro: null,
          episiorragia: null,
          extremidades: null,
          sistema_nervioso: null,
          pares_craneales: null,
          evaluacion_marcha: null,
          evaluacion_tono_muscular: null,
          evaluacion_fuerza: null,
          sistema_osteo: null,
          columna_vertebral: null,
          evaluacion_examen_mental: null,
          condicion_general: null,
          cabeza_cuello: null,
          cardio_pulmonar: null,
          examen_extremidades: null,
          reflejos_osteotendinos: null,
          examen_mama: null,
          ojos_fondo_ojos: null,
          abdomen_examen: null,
          pulsos_perifericos: null,
          piel_franeras: null,
          tacto_retal: null,
          agudeza_visual: null,
          osteomuscular: null,
          neurologico: null,
          examen_fisico_genitourinario: null,
          examen_mental: null,
          motricidad_gruesa: null,
          motricidad_fina: null,
          audicion_lenguaje: null,
          personal_social: null,
          cuidado: null,
          escala_desarrollo: null,
          autismo: null,
          rendimiento_escolar: null,
          test_figura_humana: null,
          actividades: null,
          autocontrol: null,
          comportamientos: null,
          auto_eficacia: null,
          independencia: null,
          actividades_proposito: null,
          control_interno: null,
          funciones_ejecutivas: null,
          identidad: null,
          valoracion_identidad: null,
          autonomia: null,
          valoracion_autonomia: null,
          funciones: null,
          desempenio_comunicativo: null,
          resultado_vale: null,
          factores_oido: null,
          violencia_mental: null,
          violencia_conflicto: null,
          violencia_sexual: null,
          lesiones_auto_inflingidas: null,
          riesgos_mentales_ninos: null,
          desgarro_perine: null
        },
        ccc: ['Cabeza', 'cara', 'Cuello'],
        fetal: ['Cefálica', 'Podalica', 'Transversal'],
        posne: ['Positivo', 'Negativo'],
        desgarro: ['suturado', 'No suturado'],
        estados: ['Estado 1', 'Estado 2', 'Estado 3', 'Estado 4', 'Estado 5'],
        alerta: ['Alerta', 'Medio', 'Medio Alto', 'Alto'],
        adecuada: ['Adecuada', 'No adecuada'],
        derizq: ['Derecha', 'Izquierda'],
        Episiorragia: ['Mediana', 'Mediana lateral'],
        perforacion: ['Central', 'periferica'],
        sino: ['Si', 'No'],
        indicador: ['> +3', '> +2 a ≤ +3', '> +1 a ≤ +2', '≥ -1 a ≤ +1', '≥ -2 a < -1', '< -2 a ≥ -3', '< -3'],
        indicadortalla: ['≥ -1', '≥ -2 a < -1', '< -2'],
        indicadorcefalico: ['> +2', '≥ -2 a ≤ 2', '< -2'],
        indicadorimc: ['> +3', '> +2 a ≤ +3', '> +1 a ≤ +2', '≤ +1', '> +2', '≥ -1 a ≤ +1', '≥-2 a < -1',
          '< -2'
        ],
        indicadorpeso: ['> +1', '≥ -1 a ≤ +1', '≥ -2 a < -1', '< -2'],
        headers: [{
            text: 'id',
            value: 'id'
          },
          {
            text: 'Peso',
            value: 'peso'
          },
          {
            text: 'Talla',
            value: 'talla'
          },
          {
            text: 'Imc',
            value: 'imc'
          },
          {
            text: 'Asc',
            value: 'isc'
          },
          {
            text: 'Clasificado',
            value: 'clasificacion'
          },
          {
            text: 'P-abdominal',
            value: 'perimetro_abdominal'
          },
          {
            text: 'P-cefálico',
            value: 'perimetro_cefalico'
          },
          {
            text: 'Circunferencia brazo',
            value: 'circunferencia_brazo'
          },
          {
            text: 'Circunferencia pantorrilla',
            value: 'circunferencia_pantorrilla'
          },
          {
            text: 'Peso para la talla',
            value: 'peso_talla'
          },
          {
            text: 'Clasificación peso para la talla',
            value: 'clasificacion_peso_talla'
          },
          {
            text: 'Talla para la edad',
            value: 'talla_edad'
          },
          {
            text: 'Clasificación talla para la edad',
            value: 'clasificacion_talla_edad'
          },
          {
            text: 'Perímetro cefálico para la edad',
            value: 'cefalico_edad'
          },
          {
            text: 'Clasificación perímetro cefálico para la edad',
            value: 'clasificacion_cefalico_edad'
          },
          {
            text: 'IMC para la edad',
            value: 'imc_edad'
          },
          {
            text: 'Clasificación IMC para la edad',
            value: 'clasificacion_imc_edad'
          },
          {
            text: 'Peso para la edad',
            value: 'peso_edad'
          },
          {
            text: 'Clasificación peso para la edad',
            value: 'clasificacion_peso_edad'
          },
          {
            text: 'Ganancia esperada',
            value: 'ganancia_esperada'
          }, {
            text: 'Fecha',
            value: 'created_at'
          }

        ],
        headersVitales: [{
            text: 'id',
            value: 'id'
          },
          {
            text: 'Posición',
            value: 'posicion'
          },
          {
            text: 'Lateralidad',
            value: 'lateralidad'
          },
          {
            text: 'Sistólica',
            value: 'presion_sistolica'
          },
          {
            text: 'Diastólica',
            value: 'presion_diastolica'
          },
          {
            text: 'Arterial Media',
            value: 'presion_arterial_media'
          },
          {
            text: 'Frecuencia cardiaca',
            value: 'frecuencia_cardiaca'
          },
          {
            text: 'Pulsos',
            value: 'pulsos'
          },
          {
            text: 'Frecuencia respiratoria',
            value: 'frecuencia_respiratoria'
          },
          {
            text: 'Temperatura',
            value: 'temperatura'
          },
          {
            text: 'Saturación',
            value: 'saturacion_oxigeno'
          },
          {
            text: 'Fracción inspirada de oxígeno',
            value: 'fiO'
          }

        ],
        fetchAntropoSignos: [],

      }
    },
    watch: {
      "examenF.presion_sistolica": function () {
        this.calcularMediaPresion();
      },
      "examenF.presion_diastolica": function () {
        this.calcularMediaPresion();
      },
      "examenF.peso_talla": function () {
        this.calcularPT();
      },
      "examenF.talla_edad": function () {
        this.calcularTE();
      },
      "examenF.cefalico_edad": function () {
        this.calcularPCE();
      },
      "examenF.imc_edad": function () {
        this.calcularIMCE();
      },
      "examenF.peso_edad": function () {
        this.calcularPeso();
      },
      "examenF.peso": function () {
        this.calcularASC();
      },
      "examenF.talla": function () {
        this.calcularASC()
      },
      examenF: {
        deep: true,
        handler(newVal) {
          this.calcularIMC();
          this.updateExamenF(newVal);
        },
      },

    },
    mounted() {
      this.obtenerDatosValoracion()
    },
    methods: {
      ...mapActions('medidas', ['updateExamenF']),

      // listarHistorico() {
      //   let data = {}
      //   data.afiliado = this.datos.afiliado_id;

      //   this.$axios.post("/historia/examenFisico", {
      //       afiliado: data.afiliado
      //     })
      //     .then((res) => {
      //       this.historicoExamen = res.data;
      //     })
      //     .catch((err) => {
      //       return this.$toast.error("Error al listar antecedentes personales");
      //     });
      // },


      calcularIMC() {
        const peso = parseFloat(this.examenF.peso);
        const talla = parseFloat(this.examenF.talla) / 100;

        if (!peso || !talla || talla <= 0) {
          this.examenF.imc = null;
          this.examenF.clasificacion = "Datos incompletos o incorrectos";
          return;
        }

        const imc = (peso / Math.pow(talla, 2)).toFixed(1);
        this.examenF.imc = imc;

        // Clasificar el IMC según la edad
        this.clasificarIMC(imc);

        // Actualizar el store con el nuevo IMC
        this.updateExamenF({
          imc
        });
      },

      clasificarIMC(imc) {
        const edad = this.datos.afiliado.edad_cumplida;

        if (edad < 2) {
          // Clasificación simplificada para bebés menores de 2 años
          this.examenF.clasificacion = "Evaluar peso y longitud según curvas de crecimiento";
        } else if (edad >= 2 && edad < 5) {
          // Clasificación para niños pequeños (2 a 4 años)
          if (imc < 14.0) {
            this.examenF.clasificacion = "Bajo peso";
          } else if (imc >= 14.0 && imc < 17.0) {
            this.examenF.clasificacion = "Peso normal";
          } else if (imc >= 17.0 && imc < 19.0) {
            this.examenF.clasificacion = "Sobrepeso";
          } else if (imc >= 19.0) {
            this.examenF.clasificacion = "Obesidad";
          }
        } else if (edad >= 5 && edad < 18) {
          // Clasificación para niños y adolescentes de 5 a 17 años
          if (imc < 14.5) {
            this.examenF.clasificacion = "Bajo peso";
          } else if (imc >= 14.5 && imc < 22.9) {
            this.examenF.clasificacion = "Peso normal";
          } else if (imc >= 23.0 && imc < 26.9) {
            this.examenF.clasificacion = "Sobrepeso";
          } else if (imc >= 27.0) {
            this.examenF.clasificacion = "Obesidad";
          }
        } else {
          // Clasificación para adultos (18 años en adelante)
          if (imc < 18.5) {
            this.examenF.clasificacion = "Bajo peso";
          } else if (imc >= 18.5 && imc <= 24.9) {
            this.examenF.clasificacion = "Peso normal";
          } else if (imc >= 25.0 && imc <= 29.9) {
            this.examenF.clasificacion = "Sobrepeso";
          } else if (imc >= 30.0 && imc <= 34.9) {
            this.examenF.clasificacion = "Obesidad grado I";
          } else if (imc >= 35.0 && imc <= 39.9) {
            this.examenF.clasificacion = "Obesidad grado II";
          } else if (imc >= 40.0) {
            this.examenF.clasificacion = "Obesidad grado III";
          }
        }
      },


      calcularMediaPresion() {
        this.examenF.presion_arterial_media =
          (parseInt(this.examenF.presion_diastolica) * 2 +
            parseInt(this.examenF.presion_sistolica)) /
          3;
        this.examenF.presion_arterial_media = Number.parseFloat(
          this.examenF.presion_arterial_media
        ).toFixed(1);
      },

      calcularPT() {
        if (this.examenF.peso_talla === "> +3") {
          this.examenF.clasificacion_peso_talla = "Obesidad";
        } else if (this.examenF.peso_talla === "> +2 a ≤ +3") {
          this.examenF.clasificacion_peso_talla = "Sobrepeso";
        } else if (this.examenF.peso_talla === "> +1 a ≤ +2") {
          this.examenF.clasificacion_peso_talla = "Riesgo de Sobrepeso";
        } else if (this.examenF.peso_talla === "≥ -1 a ≤ +1") {
          this.examenF.clasificacion_peso_talla = "Peso Adecuado para la Talla";
        } else if (this.examenF.peso_talla === "≥ -2 a < -1") {
          this.examenF.clasificacion_peso_talla = "Riesgo de Desnutrición Aguda";
        } else if (this.examenF.peso_talla === "< -2 a ≥ -3") {
          this.examenF.clasificacion_peso_talla = "Desnutrición Aguda Moderada*";
        } else if (this.examenF.peso_talla === "< -3") {
          this.examenF.clasificacion_peso_talla = "Desnutrición Aguda Severa*";
        }
      },

      calcularTE() {
        if (this.examenF.talla_edad === "≥ -1") {
          this.examenF.clasificacion_talla_edad = "Talla Adecuada para la Edad.";
        } else if (this.examenF.talla_edad === "≥ -2 a < -1") {
          this.examenF.clasificacion_talla_edad = "Riesgo de Talla Baja";
        } else if (this.examenF.talla_edad === "< -2") {
          this.examenF.clasificacion_talla_edad = "Talla Baja para la Edad o Retraso en Talla";
        }
      },

      calcularPCE() {
        if (this.examenF.cefalico_edad === "> +2") {
          this.examenF.clasificacion_cefalico_edad = "Factor de Riesgo para el Neurodesarrollo";
        } else if (this.examenF.cefalico_edad === "≥ -2 a ≤ 2") {
          this.examenF.clasificacion_cefalico_edad = "Normal";
        } else if (this.examenF.cefalico_edad === "< -2") {
          this.examenF.clasificacion_cefalico_edad = "Factor de Riesgo para el Neurodesarrollo";
        }
      },

      calcularIMCE() {
        if (this.examenF.imc_edad === "> +3") {
          this.examenF.clasificacion_imc_edad = "Obesidad";
        } else if (this.examenF.imc_edad === "> +2 a ≤ +3") {
          this.examenF.clasificacion_imc_edad = "Sobrepeso";
        } else if (this.examenF.imc_edad === "> +1 a ≤ +2" && this.datos.afiliado.ciclo_vida_atencion ===
          'Primera Infancia (0-5 Años)') {
          this.examenF.clasificacion_imc_edad = "Riesgo de Sobrepeso";
        } else if (this.examenF.imc_edad === "≤ +1") {
          this.examenF.clasificacion_imc_edad = "No Aplica (Verificar con P/T)";
        } else if (this.examenF.imc_edad === "> +2") {
          this.examenF.clasificacion_imc_edad = "Obesidad";
        } else if (this.examenF.imc_edad === "≥ -1 a ≤ +1") {
          this.examenF.clasificacion_imc_edad = "IMC Adecuado para la Edad";
        } else if (this.examenF.imc_edad === "≥-2 a < -1") {
          this.examenF.clasificacion_imc_edad = "Riesgo de Delgadez";
        } else if (this.examenF.imc_edad === "< -2") {
          this.examenF.clasificacion_imc_edad = "Delgadez";
        } else if (this.examenF.imc_edad === "> +1 a ≤ +2" && this.datos.afiliado.ciclo_vida_atencion ===
          'Adolescencia (12 A 17 Años)') {
          this.examenF.clasificacion_imc_edad = "Sobrepeso";
        } else if (this.examenF.imc_edad === "> +1 a ≤ +2" && this.datos.afiliado.ciclo_vida_atencion ===
          'Infancia (6-11 Años)') {
          this.examenF.clasificacion_imc_edad = "Sobrepeso";
        }
      },

      calcularPeso() {
        if (this.examenF.peso_edad === "> +1") {
          this.examenF.clasificacion_peso_edad = "No Aplica (Verificar con IMC/E)";
        } else if (this.examenF.peso_edad === "≥ -1 a ≤ +1") {
          this.examenF.clasificacion_peso_edad = "Peso Adecuado para la Edad";
        } else if (this.examenF.peso_edad === "≥ -2 a < -1") {
          this.examenF.clasificacion_peso_edad = "Riesgo de Desnutrición Global.";
        } else if (this.examenF.peso_edad === "< -2") {
          this.examenF.clasificacion_peso_edad = "Desnutrición Global.";
        }
      },
      validarErrores() {
        // Validar los campos en los tipos de historia requeridos
        return this.$refs.ExamenFisicoTriage.validate();
      },


      calcularASC() {
        this.examenF.isc = (0.007184 * Math.pow(this.examenF.peso, 0.425) * Math.pow(this.examenF.talla, 0.725))
          .toFixed(2);
      },
      obtenerDatosValoracion() {
        this.$axios.get(`historia/obtenerDatosValoracionPsicosocial/${this.datos.afiliado.id}`)
          .then(res => {
            Object.keys(res.data).forEach(key => {
              this.$set(this.examenF, key, res.data[key]);
            });
          })
          .catch(error => {
            console.error('Error al obtener los datos:', error);
            this.$toast.error('Error al obtener los datos del estilo de vida');
          });
      },
    },

  }

</script>
