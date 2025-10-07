<template>
  <div>
    <v-col cols="12">
      <v-alert text dense color="info">
        <b>ESCALA ZARIT</b>
      </v-alert>

      <v-form ref="zaritForm" v-model="valid" lazy-validation>

        <v-col cols="12" md="12" sm="12">
          <v-alert text dense color="success" border="left" icon="mdi-magnify-scan">1 ¿Cree que su familiar solicita
            más
            ayuda de la que realmente necesita?
          </v-alert>
        </v-col>

        <v-radio-group v-model="zarit.familia_solicita_ayuda" row :rules="[v => !!v || 'Este campo es requerido']">
          <v-radio label="Nunca" value="0"></v-radio>
          <v-radio label="Menos de una vez al mes" value="1"></v-radio>
          <v-radio label="Mensualmente" value="2"></v-radio>
          <v-radio label="Semanalmente" value="3"></v-radio>
          <v-radio label="A diario o casi diario" value="4"></v-radio>
        </v-radio-group>

        <v-col cols="12" md="12" sm="12">
          <v-alert text dense color="success" border="left" icon="mdi-magnify-scan">¿Cree que debido al tiempo que
            dedica a su familiar ya no dispone de
            tiempo suficiente para usted?
          </v-alert>
        </v-col>

        <v-radio-group v-model="zarit.dedica_tiempo_familia_no_para_usted" row
          :rules="[v => !!v || 'Este campo es requerido']">
          <v-radio label="Nunca" value="0"></v-radio>
          <v-radio label="Menos de una vez al mes" value="1"></v-radio>
          <v-radio label="Mensualmente" value="2"></v-radio>
          <v-radio label="Semanalmente" value="3"></v-radio>
          <v-radio label="A diario o casi diario" value="4"></v-radio>
        </v-radio-group>

        <v-col cols="12" md="12" sm="12">
          <v-alert text dense color="success" border="left" icon="mdi-magnify-scan">¿Se siente agobiado entre cuidar a
            su familiar y atender además otras
            responsabilidades en su trabajo o familia?
          </v-alert>
        </v-col>


        <v-radio-group v-model="zarit.agobiado_cuidar_familia_responsabilidades" row
          :rules="[v => !!v || 'Este campo es requerido']">
          <v-radio label="Nunca" value="0"></v-radio>
          <v-radio label="Menos de una vez al mes" value="1"></v-radio>
          <v-radio label="Mensualmente" value="2"></v-radio>
          <v-radio label="Semanalmente" value="3"></v-radio>
          <v-radio label="A diario o casi diario" value="4"></v-radio>
        </v-radio-group>

        <v-col cols="12" md="12" sm="12">
          <v-alert text dense color="success" border="left" icon="mdi-magnify-scan">¿Se siente avergonzado por la
            conducta de su familiar?
          </v-alert>
        </v-col>

        <v-radio-group v-model="zarit.avergonzado_conducta_familiar" row
          :rules="[v => !!v || 'Este campo es requerido']">
          <v-radio label="Nunca" value="0"></v-radio>
          <v-radio label="Menos de una vez al mes" value="1"></v-radio>
          <v-radio label="Mensualmente" value="2"></v-radio>
          <v-radio label="Semanalmente" value="3"></v-radio>
          <v-radio label="A diario o casi diario" value="4"></v-radio>
        </v-radio-group>

        <v-col cols="12" md="12" sm="12">
          <v-alert text dense color="success" border="left" icon="mdi-magnify-scan">¿Se siente enfadado cuando está
            cerca de su familiar?
          </v-alert>
        </v-col>
        <v-radio-group v-model="zarit.enfadado_cerca_familiar" row :rules="[v => !!v || 'Este campo es requerido']">
          <v-radio label="Nunca" value="0"></v-radio>
          <v-radio label="Menos de una vez al mes" value="1"></v-radio>
          <v-radio label="Mensualmente" value="2"></v-radio>
          <v-radio label="Semanalmente" value="3"></v-radio>
          <v-radio label="A diario o casi diario" value="4"></v-radio>
        </v-radio-group>


        <v-col cols="12" md="12" sm="12">
          <v-alert text dense color="success" border="left" icon="mdi-magnify-scan">¿Piensa que su familiar afecta
            negativamente a su relación con otros
            miembros de su familia?
          </v-alert>
        </v-col>

        <v-radio-group v-model="zarit.familiar_afecta_relacion_otros" row
          :rules="[v => !!v || 'Este campo es requerido']">
          <v-radio label="Nunca" value="0"></v-radio>
          <v-radio label="Menos de una vez al mes" value="1"></v-radio>
          <v-radio label="Mensualmente" value="2"></v-radio>
          <v-radio label="Semanalmente" value="3"></v-radio>
          <v-radio label="A diario o casi diario" value="4"></v-radio>
        </v-radio-group>

        <v-col cols="12" md="12" sm="12">
          <v-alert text dense color="success" border="left" icon="mdi-magnify-scan">¿Tiene miedo de lo que el futuro
            depare a su familiar?
          </v-alert>
        </v-col>

        <v-radio-group v-model="zarit.miedo_futuro_depare" row :rules="[v => !!v || 'Este campo es requerido']">
          <v-radio label="Nunca" value="0"></v-radio>
          <v-radio label="Menos de una vez al mes" value="1"></v-radio>
          <v-radio label="Mensualmente" value="2"></v-radio>
          <v-radio label="Semanalmente" value="3"></v-radio>
          <v-radio label="A diario o casi diario" value="4"></v-radio>
        </v-radio-group>

        <v-col cols="12" md="12" sm="12">
          <v-alert text dense color="success" border="left" icon="mdi-magnify-scan">¿Cree que su familiar depende de
            usted?
          </v-alert>
        </v-col>

        <v-radio-group v-model="zarit.familiar_depende_usted" row :rules="[v => !!v || 'Este campo es requerido']">
          <v-radio label="Nunca" value="0"></v-radio>
          <v-radio label="Menos de una vez al mes" value="1"></v-radio>
          <v-radio label="Mensualmente" value="2"></v-radio>
          <v-radio label="Semanalmente" value="3"></v-radio>
          <v-radio label="A diario o casi diario" value="4"></v-radio>
        </v-radio-group>

        <v-col cols="12" md="12" sm="12">
          <v-alert text dense color="success" border="left" icon="mdi-magnify-scan">¿Se siente tenso cuando está cerca
            de su familiar?
          </v-alert>
        </v-col>

        <v-radio-group v-model="zarit.tenso_cerca_familia" row :rules="[v => !!v || 'Este campo es requerido']">
          <v-radio label="Nunca" value="0"></v-radio>
          <v-radio label="Menos de una vez al mes" value="1"></v-radio>
          <v-radio label="Mensualmente" value="2"></v-radio>
          <v-radio label="Semanalmente" value="3"></v-radio>
          <v-radio label="A diario o casi diario" value="4"></v-radio>
        </v-radio-group>

        <v-col cols="12" md="12" sm="12">
          <v-alert text dense color="success" border="left" icon="mdi-magnify-scan">¿Cree que su salud se ha resentido
            por cuidar a su familiar?
          </v-alert>
        </v-col>

        <v-radio-group v-model="zarit.salud_resentida_por_familia" row :rules="[v => !!v || 'Este campo es requerido']">
          <v-radio label="Nunca" value="0"></v-radio>
          <v-radio label="Menos de una vez al mes" value="1"></v-radio>
          <v-radio label="Mensualmente" value="2"></v-radio>
          <v-radio label="Semanalmente" value="3"></v-radio>
          <v-radio label="A diario o casi diario" value="4"></v-radio>
        </v-radio-group>



        <v-col cols="12" md="12" sm="12">
          <v-alert text dense color="success" border="left" icon="mdi-magnify-scan">¿Cree que no tiene tanta intimidad
            como le gustaría debido a su familiar?
          </v-alert>
        </v-col>

        <v-radio-group v-model="zarit.no_tiene_intimad_por_familiar" row
          :rules="[v => !!v || 'Este campo es requerido']">
          <v-radio label="Nunca" value="0"></v-radio>
          <v-radio label="Menos de una vez al mes" value="1"></v-radio>
          <v-radio label="Mensualmente" value="2"></v-radio>
          <v-radio label="Semanalmente" value="3"></v-radio>
          <v-radio label="A diario o casi diario" value="4"></v-radio>
        </v-radio-group>

        <v-col cols="12" md="12" sm="12">
          <v-alert text dense color="success" border="left" icon="mdi-magnify-scan">¿Cree que su vida social se ha
            resentido por cuidar a su familiar?
          </v-alert>
        </v-col>

        <v-radio-group v-model="zarit.vida_social_resentida" row :rules="[v => !!v || 'Este campo es requerido']">
          <v-radio label="Nunca" value="0"></v-radio>
          <v-radio label="Menos de una vez al mes" value="1"></v-radio>
          <v-radio label="Mensualmente" value="2"></v-radio>
          <v-radio label="Semanalmente" value="3"></v-radio>
          <v-radio label="A diario o casi diario" value="4"></v-radio>
        </v-radio-group>


        <v-col cols="12" md="12" sm="12">
          <v-alert text dense color="success" border="left" icon="mdi-magnify-scan">¿Se siente incómodo por desatender
            a
            sus amistades debido a su familiar?
          </v-alert>
        </v-col>

        <v-radio-group v-model="zarit.incomodidad_desatender_amistades" row
          :rules="[v => !!v || 'Este campo es requerido']">
          <v-radio label="Nunca" value="0"></v-radio>
          <v-radio label="Menos de una vez al mes" value="1"></v-radio>
          <v-radio label="Mensualmente" value="2"></v-radio>
          <v-radio label="Semanalmente" value="3"></v-radio>
          <v-radio label="A diario o casi diario" value="4"></v-radio>
        </v-radio-group>



        <v-col cols="12" md="12" sm="12">
          <v-alert text dense color="success" border="left" icon="mdi-magnify-scan">¿Cree que su familiar parece
            esperar
            que usted sea la persona que le cuide,
            como si usted fuera la única persona de quien depende?
          </v-alert>
        </v-col>


        <v-radio-group v-model="zarit.familiar_espera_que_usted_lo_cuide" row
          :rules="[v => !!v || 'Este campo es requerido']">
          <v-radio label="Nunca" value="0"></v-radio>
          <v-radio label="Menos de una vez al mes" value="1"></v-radio>
          <v-radio label="Mensualmente" value="2"></v-radio>
          <v-radio label="Semanalmente" value="3"></v-radio>
          <v-radio label="A diario o casi diario" value="4"></v-radio>
        </v-radio-group>

        <v-col cols="12" md="12" sm="12">
          <v-alert text dense color="success" border="left" icon="mdi-magnify-scan">¿Cree que no tiene suficiente
            dinero
            para cuidar a su familiar además de sus
            otros gastos?
          </v-alert>
        </v-col>

        <v-radio-group v-model="zarit.no_posee_suficiente_dinero" row :rules="[v => !!v || 'Este campo es requerido']">
          <v-radio label="Nunca" value="0"></v-radio>
          <v-radio label="Menos de una vez al mes" value="1"></v-radio>
          <v-radio label="Mensualmente" value="2"></v-radio>
          <v-radio label="Semanalmente" value="3"></v-radio>
          <v-radio label="A diario o casi diario" value="4"></v-radio>
        </v-radio-group>

        <v-col cols="12" md="12" sm="12">
          <v-alert text dense color="success" border="left" icon="mdi-magnify-scan">¿Cree que será incapaz de
            cuidarle/a
            por mucho más tiempo?
          </v-alert>
        </v-col>

        <v-radio-group v-model="zarit.incapaz_cuidar_mas_tiempo" row :rules="[v => !!v || 'Este campo es requerido']">
          <v-radio label="Nunca" value="0"></v-radio>
          <v-radio label="Menos de una vez al mes" value="1"></v-radio>
          <v-radio label="Mensualmente" value="2"></v-radio>
          <v-radio label="Semanalmente" value="3"></v-radio>
          <v-radio label="A diario o casi diario" value="4"></v-radio>
        </v-radio-group>


        <v-col cols="12" md="12" sm="12">
          <v-alert text dense color="success" border="left" icon="mdi-magnify-scan">¿Siente que ha perdido el control
            de
            su vida desde la enfermedad de su
            familiar?
          </v-alert>
        </v-col>

        <v-radio-group v-model="zarit.perdido_control_vida_enfermedad_familiar" row
          :rules="[v => !!v || 'Este campo es requerido']">
          <v-radio label="Nunca" value="0"></v-radio>
          <v-radio label="Menos de una vez al mes" value="1"></v-radio>
          <v-radio label="Mensualmente" value="2"></v-radio>
          <v-radio label="Semanalmente" value="3"></v-radio>
          <v-radio label="A diario o casi diario" value="4"></v-radio>
        </v-radio-group>

        <v-col cols="12" md="12" sm="12">
          <v-alert text dense color="success" border="left" icon="mdi-magnify-scan">¿Desearía poder dejar el cuidado
            de
            su familiar a otros?
          </v-alert>
        </v-col>

        <v-radio-group v-model="zarit.desea_dejar_cuidar" row :rules="[v => !!v || 'Este campo es requerido']">
          <v-radio label="Nunca" value="0"></v-radio>
          <v-radio label="Menos de una vez al mes" value="1"></v-radio>
          <v-radio label="Mensualmente" value="2"></v-radio>
          <v-radio label="Semanalmente" value="3"></v-radio>
          <v-radio label="A diario o casi diario" value="4"></v-radio>
        </v-radio-group>

        <v-col cols="12" md="12" sm="12">
          <v-alert text dense color="success" border="left" icon="mdi-magnify-scan">¿Se siente indeciso sobre qué
            hacer
            con su familiar?
          </v-alert>
        </v-col>

        <v-radio-group v-model="zarit.se_siente_indeciso" row :rules="[v => !!v || 'Este campo es requerido']">
          <v-radio label="Nunca" value="0"></v-radio>
          <v-radio label="Menos de una vez al mes" value="1"></v-radio>
          <v-radio label="Mensualmente" value="2"></v-radio>
          <v-radio label="Semanalmente" value="3"></v-radio>
          <v-radio label="A diario o casi diario" value="4"></v-radio>
        </v-radio-group>



        <v-col cols="12" md="12" sm="12">
          <v-alert text dense color="success" border="left" icon="mdi-magnify-scan">¿Cree que debería hacer más por su
            familiar?
          </v-alert>
        </v-col>
        <v-radio-group v-model="zarit.deberia_hacer_mas_familiar" row :rules="[v => !!v || 'Este campo es requerido']">
          <v-radio label="Nunca" value="0"></v-radio>
          <v-radio label="Menos de una vez al mes" value="1"></v-radio>
          <v-radio label="Mensualmente" value="2"></v-radio>
          <v-radio label="Semanalmente" value="3"></v-radio>
          <v-radio label="A diario o casi diario" value="4"></v-radio>
        </v-radio-group>

        <v-col cols="12" md="12" sm="12">
          <v-alert text dense color="success" border="left" icon="mdi-magnify-scan">¿Cree que podría cuidar mejor de
            su
            familiar?
          </v-alert>
        </v-col>

        <v-radio-group v-model="zarit.cuidar_mejor_familiar" row :rules="[v => !!v || 'Este campo es requerido']">
          <v-radio label="Nunca" value="0"></v-radio>
          <v-radio label="Menos de una vez al mes" value="1"></v-radio>
          <v-radio label="Mensualmente" value="2"></v-radio>
          <v-radio label="Semanalmente" value="3"></v-radio>
          <v-radio label="A diario o casi diario" value="4"></v-radio>
        </v-radio-group>


        <v-col cols="12" md="12" sm="12">
          <v-alert text dense color="success" border="left" icon="mdi-magnify-scan">Globalmente, ¿qué grado de carga
            experimenta por el hecho de cuidar a su
            familiar?
          </v-alert>
        </v-col>

        <v-radio-group v-model="zarit.grado_carga_experimenta" row :rules="[v => !!v || 'Este campo es requerido']">
          <v-radio label="Nunca" value="0"></v-radio>
          <v-radio label="Menos de una vez al mes" value="1"></v-radio>
          <v-radio label="Mensualmente" value="2"></v-radio>
          <v-radio label="Semanalmente" value="3"></v-radio>
          <v-radio label="A diario o casi diario" value="4"></v-radio>
        </v-radio-group>

        <v-card-actions class="justify-center">
          <v-btn color="success" small @click="agregarRespuesta()" :loading="loading" :disabled="loading">Agregar
            respuestas</v-btn>
        </v-card-actions>

      </v-form>
      <v-alert border="left" v-if="interpretacion_resultados" text dense color="warning" icon="mdi-brain">
        <b> Interpretación: {{ interpretacion_resultados }}</b>
      </v-alert>
    </v-col>
  </div>
</template>


<script>
  export default {
    props: ['tipoTest', 'datos'],
    data() {
      return {
        zarit: {
          familia_solicita_ayuda: '',
          dedica_tiempo_familia_no_para_usted: '',
          agobiado_cuidar_familia_responsabilidades: '',
          avergonzado_conducta_familiar: '',
          enfadado_cerca_familiar: '',
          familiar_afecta_relacion_otros: '',
          miedo_futuro_depare: '',
          familiar_depende_usted: '',
          tenso_cerca_familia: '',
          salud_resentida_por_familia: '',
          no_tiene_intimad_por_familiar: '',
          vida_social_resentida: '',
          incomodidad_desatender_amistades: '',
          familiar_espera_que_usted_lo_cuide: '',
          no_posee_suficiente_dinero: '',
          incapaz_cuidar_mas_tiempo: '',
          perdido_control_vida_enfermedad_familiar: '',
          desea_dejar_cuidar: '',
          se_siente_indeciso: '',
          deberia_hacer_mas_familiar: '',
          cuidar_mejor_familiar: '',
          grado_carga_experimenta: '',
          interpretacion_resultados: ''
        },
        valid: false,
        loading: false,
        interpretacion_resultados: ''
      };
    },
    mounted() {
      this.obtenerDatos();
    },
    methods: {
      agregarRespuesta() {
        if (this.$refs.zaritForm.validate()) {
          this.loading = true;
          const puntuacionTotal = this.calcularPuntuacionTotal();
          this.interpretarResultados(puntuacionTotal);
          const {
            id,
            ...zaritSinId
          } = this.zarit;

          const data = {
            ...zaritSinId,
            consulta_id: this.datos.id,
            interpretacion_resultados: this.interpretacion_resultados
          };

          this.$axios.post('zarit/crear', data)
            .then(res => {
              this.loading = false;
              this.$toast.success('Se han agregado con éxito las respuestas al formulario');
            })
            .catch(error => {
              this.loading = false;
              this.$toast.error(error.response.data.error || 'Error inesperado');
              console.error(error);
            });
        } else {
          this.$toast.error('Por favor, complete todos los campos obligatorios');
        }
      },

      calcularPuntuacionTotal() {
        const preguntas = [
          this.zarit.familia_solicita_ayuda,
          this.zarit.dedica_tiempo_familia_no_para_usted,
          this.zarit.agobiado_cuidar_familia_responsabilidades,
          this.zarit.avergonzado_conducta_familiar,
          this.zarit.enfadado_cerca_familiar,
          this.zarit.familiar_afecta_relacion_otros,
          this.zarit.miedo_futuro_depare,
          this.zarit.familiar_depende_usted,
          this.zarit.tenso_cerca_familia,
          this.zarit.salud_resentida_por_familia,
          this.zarit.no_tiene_intimad_por_familiar,
          this.zarit.vida_social_resentida,
          this.zarit.incomodidad_desatender_amistades,
          this.zarit.familiar_espera_que_usted_lo_cuide,
          this.zarit.no_posee_suficiente_dinero,
          this.zarit.incapaz_cuidar_mas_tiempo,
          this.zarit.perdido_control_vida_enfermedad_familiar,
          this.zarit.desea_dejar_cuidar,
          this.zarit.se_siente_indeciso,
          this.zarit.deberia_hacer_mas_familiar,
          this.zarit.cuidar_mejor_familiar
        ];
        return preguntas.reduce((total, valor) => {
          return total + (parseInt(valor, 10) || 0);
        }, 0);
      },

      interpretarResultados(puntuacion) {
        if (puntuacion < 46) {
          this.interpretacion_resultados = 'No sobrecarga';
        } else if (puntuacion > 56) {
          this.interpretacion_resultados = 'Sobrecarga intensa';
        } else {
          this.interpretacion_resultados = '';
        }
      },

      obtenerDatos() {
        this.$axios.get(`zarit/obtenerDatos/${this.datos.afiliado.id}`).then(res => {
          this.zarit = {
            ...this.zarit,
            ...res.data
          };
          this.interpretarResultados()
        }).catch(error => {
          console.error('Error al obtener los datos:', error);
          this.$toast.error('Error al obtener los datos de zarit');
        });
      }
    }
  };

</script>
