<template>
  <div>
    <v-alert text dense color="info" border="left" class="text-center" icon="mdi-head-question-outline">
      <b>TEST SRQC</b>
    </v-alert>
    <v-col class="d-flex justify-center">
      <strong>
        APLICACION DE INSTRUMENTO
      </strong>
    </v-col>
    <v-col>
      <span>
        Las primeras 20 preguntas se refieren a problemas de salud mental como depresión, ansiedad y otros. Once o más
        respuestas positivas en este grupo determinan una alta probabilidad de sufrir uno de estos problemas.
        De la 21 a la 24 evalúa posible psicosis. Con una respuesta positiva se considera un posible caso.
        La respuesta positiva a la pregunta 25 indica alta probabilidad de sufrir un trastorno convulsivo.
        Las preguntas 26 a 30 indican problemas relacionados con el alcohol; la respuesta positiva a una sola de
        ellas determina que la persona tiene alto riesgo de sufrir alcoholismo.
      </span>
    </v-col>
    <v-divider></v-divider>
    <v-col></v-col>
    <v-form v-model="valid" ref="form" lazy-validation>
      <v-row>
        <v-col cols="12" sm="6" md="6">
          <v-autocomplete label="¿Tiene frecuentes dolores de cabeza?" dense outlined :items="opciones"
            v-model="cuestionarioSrq.dolor_cabeza_frecuente" :rules="campoRequerido"></v-autocomplete>
        </v-col>
        <v-col cols="12" sm="6" md="6">
          <v-autocomplete label="¿Tiene mal apetito?" dense outlined v-model="cuestionarioSrq.mal_apetito"
            :rules="campoRequerido" :items="opciones">
          </v-autocomplete>
        </v-col>
        <v-col cols="12" sm="6" md="6">
          <v-autocomplete label="¿Duerme mal?" dense outlined v-model="cuestionarioSrq.duerme_mal"
            :rules="campoRequerido" :items="opciones"></v-autocomplete>
        </v-col>
        <v-col cols="12" sm="6" md="6">
          <v-autocomplete label="¿Se asusta con facilidad?" dense outlined v-model="cuestionarioSrq.asusta_facilidad"
            :rules="campoRequerido" :items="opciones"></v-autocomplete>
        </v-col>
        <v-col cols="12" sm="6" md="6">
          <v-autocomplete label="¿Sufre de temblor de manos?" dense outlined v-model="cuestionarioSrq.temblor_manos"
            :rules="campoRequerido" :items="opciones"></v-autocomplete>
        </v-col>
        <v-col cols="12" sm="6" md="6">
          <v-autocomplete label="¿Se siente nervioso, tenso o aburrido?" dense outlined
            v-model="cuestionarioSrq.nervioso_tenso" :rules="campoRequerido" :items="opciones"></v-autocomplete>
        </v-col>
        <v-col cols="12" sm="6" md="6">
          <v-autocomplete label="¿Sufre de mala digestión?" dense outlined v-model="cuestionarioSrq.mala_digestion"
            :rules="campoRequerido" :items="opciones">
          </v-autocomplete>
        </v-col>
        <v-col cols="12" sm="6" md="6">
          <v-autocomplete label="¿No puede pensar con claridad?" dense outlined
            v-model="cuestionarioSrq.pensar_claridad" :rules="campoRequerido" :items="opciones"></v-autocomplete>
        </v-col>
        <v-col cols="12" sm="6" md="6">
          <v-autocomplete label="¿Se siente triste?" dense outlined v-model="cuestionarioSrq.siente_triste"
            :items="opciones" :rules="campoRequerido">
          </v-autocomplete>
        </v-col>
        <v-col cols="12" sm="6" md="6">
          <v-autocomplete label="¿Llora usted con mucha frecuencia?" dense outlined :items="opciones"
            v-model="cuestionarioSrq.llora_frecuencia" :rules="campoRequerido"></v-autocomplete>
        </v-col>
        <v-col cols="12" sm="6" md="6">
          <v-autocomplete label="¿Tiene dificultad en disfrutar de sus actividades diarias?" dense outlined
            :items="opciones" v-model="cuestionarioSrq.dificultad_disfrutar" :rules="campoRequerido">
          </v-autocomplete>
        </v-col>
        <v-col cols="12" sm="6" md="6">
          <v-autocomplete label="¿Tiene dificultad para tomar decisiones?" dense outlined :items="opciones"
            v-model="cuestionarioSrq.tomar_decisiones" :rules="campoRequerido"></v-autocomplete>
        </v-col>
        <v-col cols="12" sm="6" md="6">
          <v-autocomplete label="¿Tiene dificultad en hacer su trabajo? (¿Sufre usted con su trabajo?)" dense outlined
            :items="opciones" v-model="cuestionarioSrq.dificultad_hacer_trabajo" :rules="campoRequerido">
          </v-autocomplete>
        </v-col>
        <v-col cols="12" sm="6" md="6">
          <v-autocomplete label="¿Es incapaz de desempeñar un papel útil en su vida?" dense outlined :items="opciones"
            v-model="cuestionarioSrq.incapaz_util" :rules="campoRequerido"></v-autocomplete>
        </v-col>
        <v-col cols="12" sm="6" md="6">
          <v-autocomplete label="¿Ha perdido interés en las cosas?" dense outlined :items="opciones"
            v-model="cuestionarioSrq.interes_cosas" :rules="campoRequerido"></v-autocomplete>
        </v-col>
        <v-col cols="12" sm="6" md="6">
          <v-autocomplete label="¿Siente que usted es una persona inútil?" dense outlined :items="opciones"
            v-model="cuestionarioSrq.inutil" :rules="campoRequerido"></v-autocomplete>
        </v-col>
        <v-col cols="12" sm="6" md="6">
          <v-autocomplete label="¿Ha tenido la idea de acabar con su vida?" dense outlined :items="opciones"
            v-model="cuestionarioSrq.idea_acabar_vida" :rules="campoRequerido"></v-autocomplete>
        </v-col>
        <v-col cols="12" sm="6" md="6">
          <v-autocomplete label="¿Se siente cansado todo el tiempo?" dense outlined :items="opciones"
            v-model="cuestionarioSrq.cansado_tiempo" :rules="campoRequerido"></v-autocomplete>
        </v-col>
        <v-col cols="12" sm="6" md="6">
          <v-autocomplete label="¿Tiene sensaciones desagradables en su estómago?" dense outlined :items="opciones"
            v-model="cuestionarioSrq.estomago_desagradable" :rules="campoRequerido"></v-autocomplete>
        </v-col>
        <v-col cols="12" sm="6" md="6">
          <v-autocomplete label="¿Se cansa con facilidad?" dense outlined :items="opciones"
            v-model="cuestionarioSrq.cansa_facilidad" :rules="campoRequerido">
          </v-autocomplete>
        </v-col>
        <v-col cols="12" sm="6" md="6">
          <v-autocomplete label="¿Siente usted que alguien ha tratado de herirlo en alguna forma?" dense outlined
            :items="opciones" v-model="cuestionarioSrq.herirlo_forma" :rules="campoRequerido">
          </v-autocomplete>
        </v-col>
        <v-col cols="12" sm="6" md="6">
          <v-autocomplete label="¿Es usted una persona mucho más importante que lo que piensan los demás?" dense
            outlined :items="opciones" v-model="cuestionarioSrq.importante_demas" :rules="campoRequerido">
          </v-autocomplete>
        </v-col>
        <v-col cols="12" sm="6" md="6">
          <v-autocomplete label="¿Oye voces sin saber de dónde vienen o que otras personas no pueden oír?" dense
            outlined :items="opciones" v-model="cuestionarioSrq.voces" :rules="campoRequerido"></v-autocomplete>
        </v-col>
        <v-col cols="12" sm="6" md="6">
          <v-autocomplete
            label="¿Ha tenido convulsiones, ataques o caídas al suelo, como movimientos de brazos y piernas; con mordeduras de lengua o pérdida del conocimiento?"
            dense outlined v-model="cuestionarioSrq.convulsiones_ataques" :rules="campoRequerido" :items="opciones">
          </v-autocomplete>
        </v-col>
        <v-col cols="12" sm="6" md="6">
          <v-autocomplete
            label="¿Alguna vez le ha parecido a su familia, sus amigos, su médico o a su sacerdote que usted estaba bebiendo demasiado licor?"
            dense outlined v-model="cuestionarioSrq.demasiado_licor" :rules="campoRequerido" :items="opciones">
          </v-autocomplete>
        </v-col>

        <v-col cols="12" sm="6" md="6">
          <v-autocomplete label="¿Alguna vez ha querido dejar de beber, pero no ha podido?" :items="opciones"
            v-model="cuestionarioSrq.dejar_beber" dense outlined :rules="campoRequerido"></v-autocomplete>
        </v-col>
        <v-col cols="12" sm="6" md="6">
          <v-autocomplete
            label="¿Ha tenido alguna vez dificultades en el trabajo (o estudio) a causa de la bebida, como beber en el trabajo o en el colegio, o faltar a ellos?"
            v-model="cuestionarioSrq.beber_trabajo" dense outlined :rules="campoRequerido" :items="opciones">
          </v-autocomplete>
        </v-col>
        <v-col cols="12" sm="6" md="6">
          <v-autocomplete label="¿Ha estado en riñas o lo han detenido estando borracho?" dense outlined
            :items="opciones" v-model="cuestionarioSrq.detenido_borracho" :rules="campoRequerido"></v-autocomplete>
        </v-col>
        <v-col cols="12" sm="6" md="6">
          <v-autocomplete label="¿Le ha parecido alguna vez que usted bebía demasiado?" dense outlined :items="opciones"
            v-model="cuestionarioSrq.bebia_demasiado" :rules="campoRequerido"></v-autocomplete>
        </v-col>
      </v-row>
    </v-form>

    <v-alert v-if="cuestionarioSrq.interpretacion_resultado" text dense color="info" border="left" class="text-center"
      icon="mdi-information-outline">
      <b>INTERPRETACIÓN DE RESULTADOS</b>
      <v-divider class="my-2"></v-divider>
      <pre>{{ cuestionarioSrq.interpretacion_resultado }}</pre>
    </v-alert>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
  export default {
    props: ['datos'],
    data() {
      return {
        cuestionarioSrq: {
          dolor_cabeza_frecuente: null,
          mal_apetito: null,
          duerme_mal: null,
          asusta_facilidad: null,
          temblor_manos: null,
          nervioso_tenso: null,
          mala_digestion: null,
          pensar_claridad: null,
          siente_triste: null,
          llora_frecuencia: null,
          dificultad_disfrutar: null,
          tomar_decisiones: null,
          dificultad_hacer_trabajo: null,
          incapaz_util: null,
          interes_cosas: null,
          inutil: null,
          idea_acabar_vida: null,
          cansado_tiempo: null,
          estomago_desagradable: null,
          cansa_facilidad: null,
          herirlo_forma: null,
          importante_demas: null,
          voces: null,
          convulsiones_ataques: null,
          demasiado_licor: null,
          dejar_beber: null,
          beber_trabajo: null,
          detenido_borracho: null,
          bebia_demasiado: null,
          consulta_id: this.datos.id,
          interpretacion_resultado: null
        },
        valid: false,
        respuestasTest: '',
        campoRequerido: [
          v => !!v || 'Campo requerido',
        ],
        loading: false,
        opciones: ['Si', 'No']
      }
    },

    mounted() {
        const datosSrq = this.obtenerDatosPorConsulta(this.datos.id, 'testSrq/Model/srq', 'historia/formularios/TestSrq');

      if (datosSrq) {
        this.cuestionarioSrq = { ...datosSrq }
      } else {
        this.cargarDatos();

        }
    },

    watch: {
        cuestionarioSrq: {
            handler(nuevoValor) {
            const respuestas = Object.entries(nuevoValor)
                .filter(([key, _]) => key !== 'consulta_id' && key !== 'interpretacion_resultado')
                .map(([_, value]) => value);

            const algunaRespondida = respuestas.some(r => r === 'Si' || r === 'No');

            this.cuestionarioSrq.interpretacion_resultado = algunaRespondida ? this.calcularInterpretacion() : '';
            },
            deep: true
        }
    },
    computed: {
        ...mapGetters('historiaClinica', ['obtenerDatosPorConsulta']),
    },
    methods: {
        obtenerDatos() {
            return { datos: this.cuestionarioSrq };
        },
      crearTest() {
        if (!this.$refs.form.validate()) {
          return this.$toast.error('Por favor, complete todos los campos requeridos');
        }
        this.loading = true;
        this.cuestionarioSrq.interpretacion_resultado = this.calcularInterpretacion();
        this.$axios.post('srq/crear', this.cuestionarioSrq).then(() => {
          this.$toast.success('Creado con exito');
          this.respuestasTest = this.calcularInterpretacion();
		  this.cargarDatos();
        }).catch((error) => {
          console.log(error)
        }).finally(() => {
          this.loading = false;
        })
      },

      cargarDatos() {
        this.$axios.get(`srq/obtenerDatos/${this.datos.afiliado.id}`).then(res => {
          this.cuestionarioSrq = {
            ...this.cuestionarioSrq,
            ...res.data
          }
          this.cuestionarioSrq.interpretacion_resultado = this.calcularInterpretacion();
        }).catch(error => {
          console.log(error);
          this.$toast.error('Error al cargar los datos');
        });
      },

      calcularInterpretacion() {
        const respuestas = Object.values(this.cuestionarioSrq).slice(0,
        30); // Obtener las respuestas de las 30 preguntas
        const respuestasPositivas = respuestas.filter(respuesta => respuesta === 'Si').length;

        // Interpretación de resultados
        let interpretacion = '';

        // Preguntas 1-20: Salud mental
        const saludMental = respuestas.slice(0, 20).filter(respuesta => respuesta === 'Si').length;
        if (saludMental >= 11) {
          interpretacion += 'Alta probabilidad de sufrir problemas de salud mental (depresión, ansiedad, etc.).\n';
        }

        // Preguntas 21-24: Psicosis
        const psicosis = respuestas.slice(20, 24).filter(respuesta => respuesta === 'Si').length;
        if (psicosis >= 1) {
          interpretacion += 'Posible caso de psicosis.\n';
        }

        // Pregunta 25: Trastorno convulsivo
        if (respuestas[24] === 'Si') {
          interpretacion += 'Alta probabilidad de sufrir un trastorno convulsivo.\n';
        }

        // Preguntas 26-30: Alcoholismo
        const alcoholismo = respuestas.slice(25, 30).filter(respuesta => respuesta === 'Si').length;
        if (alcoholismo >= 1) {
          interpretacion += 'Alto riesgo de sufrir alcoholismo.\n';
        }

        // Si no hay resultados positivos
        if (interpretacion === '') {
          interpretacion = 'No se detectaron problemas significativos según las respuestas proporcionadas.';
        }

        return interpretacion;
      },
      validarErrores() {
            const campos = { ...this.cuestionarioSrq };
            delete campos.consulta_id;
            delete campos.interpretacion_resultado;

            const algunCampoLleno = Object.values(campos).some(
                valor => valor !== '' && valor !== null && valor !== undefined
            );

            // Si ningún campo fue diligenciado, no validamos, simplemente decimos que no hay errores
            if (!algunCampoLleno) {
                return true;
            }

            // Solo si hay algún campo diligenciado, validamos todo el formulario
            return this.$refs.form.validate();
        },
    }
  }

</script>
