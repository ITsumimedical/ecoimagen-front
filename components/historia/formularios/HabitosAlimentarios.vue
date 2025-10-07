<template>
  <div>
    <v-col cols="12" md="12" sm="12">
      <v-alert text dense color="info" prominent icon="mdi-pill">
        <b>HABITOS ALIMENTARIOS</b>
      </v-alert>
    </v-col>

    <v-form ref="habitosAlimentariosForm" lazy-validation>

    <v-row>
      <v-col cols="12" md="4" sm="4">
        <v-autocomplete label="¿Lactando actualmente?" :items="opciones"
          v-model="habitosAlimentarios.lactando_actualmente" outlined dense :rules="CampoRequerido">
        </v-autocomplete>
      </v-col>

      <v-col cols="12" md="4" sm="4">
        <v-autocomplete label="¿Lactancia materna exclusiva?" :items="opciones"
          v-model="habitosAlimentarios.lactancia_materna_exclusiva" outlined dense :rules="CampoRequerido">
        </v-autocomplete>
      </v-col>

      <v-col cols="12" md="4" sm="4" v-if="habitosAlimentarios.lactando_actualmente == true">
        <v-text-field label="¿Postura de la madre y niño?" v-model="habitosAlimentarios.postura_madre_niño" outlined
          dense :rules="CampoRequerido">
        </v-text-field>
      </v-col>

      <v-col cols="12" md="4" sm="4" v-if="habitosAlimentarios.lactando_actualmente == true">
        <v-text-field label="Agarre" v-model="habitosAlimentarios.agarre" outlined dense :rules="CampoRequerido">
        </v-text-field>
      </v-col>
      <v-col cols="12" md="4" sm="4" v-if="habitosAlimentarios.lactando_actualmente == true">
        <v-text-field label="Succión" v-model="habitosAlimentarios.succion" outlined dense :rules="CampoRequerido">
        </v-text-field>
      </v-col>

      <v-col cols="12" md="4" sm="4">
        <v-autocomplete :items="opciones" label="¿La madre reconoce el hambre y saciedad del bebe?"
          v-model="habitosAlimentarios.madre_reconoce_hambre_saciedad_bebe" outlined dense :rules="CampoRequerido">
        </v-autocomplete>
      </v-col>

      <v-col cols="12" md="4" sm="4">
        <v-text-field label="¿Necesidades de la madre sobre la práctica de la lactancia materna?"
          v-model="habitosAlimentarios.necesidades_madre_lactancia_materna" outlined dense :rules="CampoRequerido">
        </v-text-field>
      </v-col>

      <v-col cols="12" md="4" sm="4">
        <v-autocomplete :items="opciones" label="¿Recibió preparación prenatal para la lactancia materna?"
          v-model="habitosAlimentarios.recibio_preparacion_prenatal" outlined dense :rules="CampoRequerido">
        </v-autocomplete>
      </v-col>

      <v-col cols="12" md="4" sm="4">
        <v-autocomplete :items="opciones"
          label="¿Se suministra leche de formula antes del egreso hospitalario neonatal?"
          v-model="habitosAlimentarios.suministra_leche_hospitalario_neonatal" outlined dense :rules="CampoRequerido">
        </v-autocomplete>
      </v-col>


      <v-col cols="12" md="4" sm="4">
        <v-text-field label="¿Expectativas de la madre y familia frente a la lactancia materna?"
          v-model="habitosAlimentarios.expectativas_madre_familia" outlined dense :rules="CampoRequerido">
        </v-text-field>
      </v-col>

      <v-col cols="12" md="4" sm="4">
        <v-text-field label="Frecuencia de lactancia" v-model="habitosAlimentarios.frecuencia_lactancia" outlined dense :rules="CampoRequerido">
        </v-text-field>
      </v-col>

      <v-col cols="12" md="4" sm="4">
        <v-text-field label="Duración de lactancia" v-model="habitosAlimentarios.duracion_lactancia" outlined dense :rules="CampoRequerido">
        </v-text-field>
      </v-col>

      <v-col cols="12" md="4" sm="4">
        <v-text-field label="Dificultades con la lactancia materna"
          v-model="habitosAlimentarios.dificultades_lactancia_materna" outlined dense :rules="CampoRequerido">
        </v-text-field>
      </v-col>

      <v-col cols="12" md="4" sm="4">
        <v-autocomplete :items="opciones" label="¿La madre se extrae y conserva la leche?"
          v-model="habitosAlimentarios.madre_extrae_conserva_leche" outlined dense :rules="CampoRequerido">
        </v-autocomplete>
      </v-col>

      <v-col cols="12" md="4" sm="4">
        <v-text-field label="Como realiza la extracción, conservación y transporte de la leche"
          v-model="habitosAlimentarios.como_realiza_extraccion_conservacion_leche" outlined dense :rules="CampoRequerido">
        </v-text-field>
      </v-col>

      <v-col cols="12" md="4" sm="4">
        <v-autocomplete :items="opciones" label="¿Alimentado con leche de fórmula?"
          v-model="habitosAlimentarios.alimentado_leche_formula" outlined dense :rules="CampoRequerido">
        </v-autocomplete>
      </v-col>

      <v-layout v-if="datos.cita.tipo_historia_id !==6">
      <v-col cols="12" md="4" sm="4">
        <v-autocomplete :items="opciones" label="¿Inicio otros alimentos, agua, aromatica u otra bebida?"
          v-model="habitosAlimentarios.inicio_alimentos_agua_otra_bebida" outlined dense :rules="CampoRequerido">
        </v-autocomplete>
      </v-col>

      <v-col cols="12" md="4" sm="4">
        <v-autocomplete :items="opciones"
          label="¿Durante el día de ayer  recibió alguno de los siguientes liquidos: agua, aromatica, jugo, té?"
          v-model="habitosAlimentarios.durante_dia_ayer_recibio_liquidos" outlined dense :rules="CampoRequerido">
        </v-autocomplete>
      </v-col>

      <v-col cols="12" md="4" sm="4">
        <v-autocomplete :items="opciones" label="¿Durante el dia de ayer recibió leche de formula?"
          v-model="habitosAlimentarios.durante_dia_recibio_leche" outlined dense :rules="CampoRequerido">
        </v-autocomplete>
      </v-col>

      <v-col cols="12" md="4" sm="4">
        <v-autocomplete :items="opciones"
          label="¿Durante el dia de ayer recibió leche (vaca, cabra) liquida, polvo, fresca o en bolsa?"
          v-model="habitosAlimentarios.durante_dia_recibio_leche_vaca" outlined dense :rules="CampoRequerido">
        </v-autocomplete>
      </v-col>

      <v-col cols="12" md="4" sm="4">
        <v-autocomplete :items="opciones"
          label="¿Durante el dia de ayer o anoche recibió algún alimento como sopa espesa, puré, papilla, o seco?"
          v-model="habitosAlimentarios.durante_dia_recibio_sopa" outlined dense :rules="CampoRequerido">
        </v-autocomplete>
      </v-col>

      <v-col cols="12" md="4" sm="4">
        <v-text-field label="Edad en meses de introducción de los diferentes alimentos"
          v-model="habitosAlimentarios.edad_meses_diferentes_alimentos" outlined dense :rules="CampoRequerido">
        </v-text-field>
      </v-col>

      <v-col cols="12" md="4" sm="4">
        <v-autocomplete :items="opciones" label="¿Consumo de la dieta familiar?"
          v-model="habitosAlimentarios.consumo_dieta_familiar" outlined dense :rules="CampoRequerido">
        </v-autocomplete>
      </v-col>

      <v-col cols="12" md="4" sm="4">
        <v-autocomplete :items="comidas" label="¿Cuantas comidas realiza en el día?"
          v-model="habitosAlimentarios.cuantas_comidas_dia" outlined dense :rules="CampoRequerido">
        </v-autocomplete>
      </v-col>

      <v-col cols="12" md="4" sm="4">
        <v-autocomplete :items="opciones" label="¿Consumo de 5 o más porciones de frutas y vegetales en el día?"
          v-model="habitosAlimentarios.consumo_5_porciones_frutas" outlined dense :rules="CampoRequerido">
        </v-autocomplete>
      </v-col>

      <v-col cols="12" md="4" sm="4">
        <v-autocomplete :items="opciones" label="¿Dieta balanceada baja en azúcares, sal, grasas y carbohidrato?"
          v-model="habitosAlimentarios.dieta_balanceada_baja_azucares" outlined dense :rules="CampoRequerido">
        </v-autocomplete>
      </v-col>
    </v-layout>
    </v-row>
    </v-form>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
  export default {

    props: ['datos'],

    data() {
      return {
        opciones: [
          {
            text: 'Si',
            value: true
          },
          {
            text: 'No',
            value: false
          },
        ],
         CampoRequerido: [
           v => v !== '' && v !== null && v !== undefined || 'Este campo es requerido',
         ],
        comidas: ['1', '2', '3', '4', '5', '6'],
        habitosAlimentarios: {
          lactando_actualmente: '',
          lactancia_materna_exclusiva: '',
          postura_madre_niño: '',
          agarre: '',
          succion: '',
          madre_reconoce_hambre_saciedad_bebe: '',
          necesidades_madre_lactancia_materna: '',
          recibio_preparacion_prenatal: '',
          suministra_leche_hospitalario_neonatal: '',
          expectativas_madre_familia: '',
          frecuencia_lactancia: '',
          duracion_lactancia: '',
          dificultades_lactancia_materna: '',
          madre_extrae_conserva_leche: '',
          como_realiza_extraccion_conservacion_leche: '',
          alimentado_leche_formula: '',
          inicio_alimentos_agua_otra_bebida: '',
          durante_dia_ayer_recibio_liquidos: '',
          durante_dia_recibio_leche: '',
          durante_dia_recibio_leche_vaca: '',
          durante_dia_recibio_sopa: '',
          edad_meses_diferentes_alimentos: '',
          consumo_dieta_familiar: '',
          cuantas_comidas_dia: '',
          consumo_5_porciones_frutas: '',
          dieta_balanceada_baja_azucares: '',
          consulta_id: this.datos.id,
        }
      }
    },
    computed: {
        ...mapGetters('historiaClinica', ['obtenerDatosPorConsulta']),
    },
    created() {
        const datosHabitos = this.obtenerDatosPorConsulta(this.datos.id, 'HabitosAlimentarios/Model/HabitosAlimentarios', 'historia/formularios/HabitosAlimentarios');

        if (datosHabitos) {
            this.habitosAlimentarios = {...datosHabitos};
        }
    },
    methods: {

      obtenerDatos() {
                return {
                    datos: this.habitosAlimentarios
                };

            },

        validarErrores() {
            const campos = { ...this.habitosAlimentarios };
            delete campos.consulta_id;

            const algunCampoLleno = Object.values(campos).some(
                valor => valor !== '' && valor !== null && valor !== undefined
            );

            // Si ningún campo fue diligenciado, no validamos, simplemente decimos que no hay errores
            if (!algunCampoLleno) {
                return true;
            }

            // Solo si hay algún campo diligenciado, validamos todo el formulario
            return this.$refs.habitosAlimentariosForm.validate();
        }

    }
  }

</script>
