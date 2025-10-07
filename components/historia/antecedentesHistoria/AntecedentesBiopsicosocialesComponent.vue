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
          <v-row dense>
            <!-- <v-row dense v-show="!([1, 7,6, 27, 31].includes(datos.cita.tipo_historia_id))">
              <v-col cols="12" sm="12" md="12">
                <v-alert dense text border="left" icon="mdi-reproduction" color="info" class="text-center">
                  <b>Antecedentes Sexuales y reproductivos</b>
                </v-alert>
              </v-col>
              <v-col cols="12" sm="6" md="3"
                v-show="datos.afiliado.ciclo_vida_atencion != 'Primera Infancia (0-5 Años)' && datos.cita.tipo_historia_id !==1">
                <v-select dense v-model="form.orientacion_sex" :items="orientacionsex" label="Orientación sexual">
                </v-select>
              </v-col>
              <v-col cols="12" sm="6" md="3"
                v-show="datos.afiliado.ciclo_vida_atencion !='Primera Infancia (0-5 Años)' && datos.cita.tipo_historia_id !==1">
                <v-select dense v-model="form.identidad_genero" :items="identidadgenero" label="Identidad género">
                </v-select>

              </v-col>
              <v-col cols="12" sm="6" md="3"
                v-if="datos.afiliado.ciclo_vida_atencion !='Primera Infancia (0-5 Años)' & form.identidad_genero =='Transgenero' && datos.cita.tipo_historia_id !==1">
                <v-select dense v-model="form.identidad_generotransgenero" :items="Transgenero" label="Tipo">
                </v-select>
              </v-col>

              <v-col cols="12" sm="6" md="3"
                v-show="datos.afiliado.ciclo_vida_atencion !='Primera Infancia (0-5 Años)' && datos.cita.tipo_historia_id !==1">
                <v-text-field dense type="number" v-model="form.inicio_sexual" label="Edad inicio relaciones sexuales">
                </v-text-field>
               </v-col>
              <v-col cols="12" sm="6" md="3"
                v-show="datos.afiliado.ciclo_vida_atencion !='Primera Infancia (0-5 Años)' && datos.cita.tipo_historia_id !==1">
                <v-text-field dense type="number" v-model="form.numero_relaciones" label="Número de compañeros sexuales">
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="2"
                v-show="datos.afiliado.ciclo_vida_atencion !='Primera Infancia (0-5 Años)' && datos.cita.tipo_historia_id !==1">
                <v-select dense v-model="form.activo_sexual" :items="sino" label="Activo sexualmente">
                </v-select>
              </v-col>
              <v-col cols="12" sm="6" md="4"
                v-show="datos.afiliado.ciclo_vida_atencion !='Primera Infancia (0-5 Años)' & datos.afiliado.ciclo_vida_atencion !='Infancia (6-11 Años)' && datos.cita.tipo_historia_id !==1">
                <v-select dense v-model="form.dificultades_relaciones" :items="sino"
                  label="¿Tiene dificultades durante las relaciones sexuales?">
                </v-select>
              </v-col>
              <v-col cols="12" sm="6" md="3"
                v-show="datos.afiliado.ciclo_vida_atencion !='Primera Infancia (0-5 Años)' & datos.afiliado.ciclo_vida_atencion !='Infancia (6-11 Años)'  & form.dificultades_relaciones =='Si' && datos.cita.tipo_historia_id !==1">
                <v-textarea name="input-7-1" v-model="form.descripciondificultad" rows="1" label="Descripción dificultad">
                </v-textarea>
              </v-col>
              <v-col cols="12" sm="6" md="3"
                v-show="datos.afiliado.ciclo_vida_atencion != 'Primera Infancia (0-5 Años)' & datos.afiliado.ciclo_vida_atencion != 'Infancia (6-11 Años)' && datos.cita.tipo_historia_id !==1">
                <v-select dense v-model="form.uso_anticonceptivos" :items="sino" label="¿Usa usted algún método anticonceptivo">
                </v-select>
              </v-col>
              <v-col cols="12" sm="6" md="2"
                v-show="datos.afiliado.ciclo_vida_atencion != 'Primera Infancia (0-5 Años)' & datos.afiliado.ciclo_vida_atencion != 'Infancia (6-11 Años)' & form.uso_anticonceptivos=='Si' && datos.cita.tipo_historia_id !==1">
                <v-select dense v-model="form.tipo_anticonceptivos" :items="tipoanticonceptivo" label="Tipo">
                </v-select>
              </v-col>
              <v-col cols="12" sm="6" md="4"
                v-show="datos.afiliado.ciclo_vida_atencion !='Primera Infancia (0-5 Años)' & datos.afiliado.ciclo_vida_atencion !='Infancia (6-11 Años)' && datos.cita.tipo_historia_id !==1">
                <v-select dense v-model="form.conocimiento_its" :items="sino"
                  label="¿Tiene conocimiento en enfermedades de transmisión sexual?">
                </v-select>
              </v-col>
              <v-col cols="12" sm="6" md="4"  v-show="datos.afiliado.ciclo_vida_atencion != 'Primera Infancia (0-5 Años)'">
                <v-select dense v-model="form.sufrido_its" :items="sino"
                  label="¿Ha sufrido alguna enfermedad de transmisión sexual?">
                </v-select>
              </v-col>
              <v-col cols="12" sm="6" md="3" v-if=" form.sufrido_its =='Si'">
                <v-textarea name="input-7-1" v-model="form.cualits" rows="1" label="Cual">
                </v-textarea>
              </v-col>
              <v-col cols="12" sm="6" md="3" v-if="form.sufrido_its =='Si'">
                <v-text-field dense type="date" v-model="form.fecha_enfermedadits" label="Fecha enfermedad">
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="3" v-if="form.sufrido_its =='Si'">
                <v-textarea name="input-7-1" v-model="form.tratamientoits" label="Tratamiento" rows="1">
                </v-textarea>
              </v-col>
              <v-col cols="12" sm="6" md="6"
                v-show="datos.afiliado.ciclo_vida_atencion !='Primera Infancia (0-5 Años)' & datos.afiliado.ciclo_vida_atencion !='Infancia (6-11 Años)' && datos.cita.tipo_historia_id !==1">
                <v-select dense v-model="form.trasnmision_sexual" :items="sino"
                  label="¿Utiliza protección para la prevencion de enfermedades de transmision sexual y/o VIH?">
                </v-select>
              </v-col>
              <v-col cols="12" sm="6" md="6" v-show="datos.afiliado.ciclo_vida_atencion !='Primera Infancia (0-5 Años)'">
                <v-select dense v-model="form.derechos_sexuales" :items="sino"
                  label="¿Tiene conocimiento sobre sus derechos sexuales y reproductivos?">
                </v-select>
              </v-col>
              <v-col cols="12" sm="6" md="6"
                v-show="datos.afiliado.ciclo_vida_atencion !='Primera Infancia (0-5 Años)' & datos.afiliado.ciclo_vida_atencion !='Infancia (6-11 Años)' && datos.cita.tipo_historia_id !==1">
                <v-select dense v-model="form.decisionessexrep" :items="sino"
                  label="¿Toma usted  decisiones alrededor de su sexualidad y reproducción?">
                </v-select>
              </v-col>
              <v-col cols="12" sm="6" md="3"
                v-show="datos.afiliado.ciclo_vida_atencion !='Primera Infancia (0-5 Años)' & datos.afiliado.ciclo_vida_atencion !='Infancia (6-11 Años)' && datos.cita.tipo_historia_id !==1">
                <v-select dense v-model="form.victima_identidadgenero" :items="sino"
                  label="¿Ha sido victima de identidad de Genero?">
                </v-select>

              </v-col>
              <v-col cols="12" sm="6" md="3"
                v-show="datos.afiliado.ciclo_vida_atencion !='Primera Infancia (0-5 Años)' & datos.afiliado.ciclo_vida_atencion !='Infancia (6-11 Años)' & form.victima_identidadgenero=='Si' && datos.cita.tipo_historia_id !==1">
                <v-select dense v-model="form.tipo_victimagenero" :items="tipovictimaidentigenero" label="Tipo violencia">
                </v-select>
              </v-col>
              <v-col cols="12" sm="6" md="6"
                v-show="datos.afiliado.ciclo_vida_atencion !='Primera Infancia (0-5 Años)' & datos.afiliado.ciclo_vida_atencion !='Infancia (6-11 Años)' && datos.cita.tipo_historia_id !==1">
                <v-select dense v-model="form.victima_genero" :items="sino"
                  label="¿Ha sido victima de violencia contra la mujer y/o violencia de género?">
                </v-select>
              </v-col>
              <v-col cols="12" sm="6" md="6"
                v-show="datos.afiliado.ciclo_vida_atencion !='Primera Infancia (0-5 Años)' & datos.afiliado.ciclo_vida_atencion !='Infancia (6-11 Años)' & form.victima_genero=='Si' && datos.cita.tipo_historia_id !==1">
                <v-select dense v-model="form.tipo_victima_violencia_genero" :items="tipovictimagenero" label="Tipo">
                </v-select>
              </v-col>
              <v-col cols="12" sm="6" md="6"
                v-show="datos.afiliado.ciclo_vida_atencion !='Primera Infancia (0-5 Años)' & datos.afiliado.ciclo_vida_atencion !='Infancia (6-11 Años)' && datos.cita.tipo_historia_id !==1">
                <v-select dense v-model="form.violencia" :items="sino"
                  label="¿Ha sido víctima de violencia física y sexual en algún momento de su vida?">
                </v-select>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-select dense v-model="form.presenciamutilacion" :items="sino"
                  label="¿Ha sido víctima de mutilación genital?">
                </v-select>
              </v-col>
              <v-col
                v-show="datos.afiliado.ciclo_vida_atencion !='Joven (18 A 28 Años)' & datos.afiliado.ciclo_vida_atencion !='Adulto (29 A 59 Años)' & datos.afiliado.ciclo_vida_atencion !='Vejez (Mayor a 60 Años)'">
                <v-select dense v-model="form.matrimonioinfantil" :items="sino"
                  label="¿Ha sido víctima de matrimonio forzoso o en etapa infantil?">
                </v-select>
              </v-col>
            </v-row> -->

            <!-- <v-row dense v-show="!([1, 6, 7, 10, 27, 31].includes(datos.cita.tipo_historia_id))">
              <v-col cols="12" sm="12" md="12">
                <v-alert dense text border="left" icon="mdi-clipboard-text" type="success" color="blue-grey"
                  class="text-center">
                  <b>Antecedentes Biopsicosociales Ecomapa</b>
                </v-alert>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-checkbox dense color="success" v-model="form.trabaja" value="1" label="Trabaja">
                </v-checkbox>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-checkbox dense color="success" v-model="form.asiste_iglesia" value="1" label="Asiste a la iglesia">
                </v-checkbox>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-checkbox dense color="success" v-model="form.pertenece_club_deportivo" value="1"
                  label="Pertenece a algún club deportivo">
                </v-checkbox>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-checkbox dense color="success" v-model="form.comparte_amigos" value="1" label="Comparte con sus amigos">
                </v-checkbox>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-checkbox dense color="success" v-model="form.asiste_colegio" value="1" label="Asiste al coelgio">
                </v-checkbox>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-checkbox dense color="success" v-model="form.comparte_vecinos" value="1" label="Comparte con sus vecinos">
                </v-checkbox>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-checkbox dense color="success" v-model="form.pertenece_club_social_cultural" value="1"
                  label="Pertenece a algún club social o cultural">
                </v-checkbox>
              </v-col>

              <v-col cols="12" sm="6" md="12" class="text-center mt-9">
                <v-btn color="boton" small dark @click="guardar()">guardar</v-btn>
              </v-col>
            </v-row> -->

            <v-col></v-col>
            <v-row dense  v-show="!([1].includes(datos.cita.tipo_historia_id))">
              <v-col cols="12" sm="12" md="12">
                <v-alert dense text border="left" icon="mdi-clipboard-text" type="info" color="blue-grey" class="text-center">
                  <b>Apgar Familiar</b>
                </v-alert>
              </v-col>
              <v-col cols="12" sm="6" md="3" v-for="c in arrCheckBox" :key="c.id">
                <label style="font-size: 8px;">
                  <h2>{{c.nombre}}</h2>
                </label>
                <v-radio-group dense style="font-size: 8px" v-model="apgarFamiliar[c.model]">
                  <v-radio color="red" v-for="n in c.options" :key="n.val" :label="n.nombre" :value="n.val"></v-radio>
                </v-radio-group>
              </v-col>

            <v-col cols="12" sm="12" md="12" style="text-align: center">
              <label style="font-size: large"><b>Resultado:{{ resultadoApgar }}</b></label>
            </v-col>

            <v-col cols="12" sm="12" md="12">
              <v-col cols="12" sm="12" md="12">
                <v-alert dense :type="tipoResultado" :color="colorAlerta" :icon="tipoResultado" text>
                  <b>Nota: {{ mensajeResultado }}</b>
                </v-alert>
              </v-col>
            </v-col>



              <v-col xs12 sm12 md12 style="text-align: center">
                <v-btn color="success" dark small @click="saveResultado()" :loading="loading">Guardar Resultado</v-btn>
              </v-col>
            </v-row>

            <v-col></v-col>

            <!-- <v-row dense v-show="!([1, 10, 27, 31].includes(datos.cita.tipo_historia_id))">
              <v-col cols="12" sm="12" md="12">
                <v-alert dense text border="left" icon="mdi-human-male-male-child" type="info" color="blue-grey" class="text-center">
                  <b>Familiograma</b>
                </v-alert>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-select dense v-model="familiograma.vinculos" :items="vinculos" label="Vinculos:">
                </v-select>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-select dense v-model="familiograma.relacion" :items="afectiva" label="Relación afectiva">
                </v-select>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-select dense v-model="familiograma.tipo_familia" :items="tipofamilia" label="Tipo familia">
                </v-select>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-text-field dense type="number" v-model="familiograma.hijos_conforman" min="0"
                  label="Número de hijos que conforman la familia:">
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="2">
                <v-select dense v-model="familiograma.problemas_de_salud" :items="sino" label="¿Problemas salud/enfermedad?">
                </v-select>
              </v-col>

              <v-col cols="12" sm="6" md="5">
                <v-textarea v-model="familiograma.cual_salud" v-if="familiograma.problemas_de_salud == 'Si'" rows="1"
                  label="¿Cuál?">
                </v-textarea>

              </v-col>
              <v-col cols="12" sm="6" md="5">
                <v-textarea v-model="familiograma.observacion_salud" rows="1"
                  v-if="familiograma.problemas_de_salud == 'Si'" label="Observación">
                </v-textarea>
              </v-col>
              <v-col cols="12" sm="6" md="12">
                <v-textarea v-model="familiograma.responsable_ingreso" outlined label="Responsables ingresos familia:">
                </v-textarea>
              </v-col>
              <v-col cols="12" sm="6" md="12">
                <v-card-actions class="justify-center">
                <v-btn small dark color="success" class="mt-2" @click="guardarFamiliograma()">
                  Guardar
                </v-btn>
              </v-card-actions>
              </v-col>
            </v-row> -->

            <template v-if="!([1,6, 7, 27, 31].includes(datos.cita.tipo_historia_id)) && datos.afiliado.edad_cumplida > 17">
              <v-col cols="12" sm="12" md="12">
                <v-alert dense text icon="mdi-cash" type="success" color="blue-grey" border="left"
                  class="text-center">
                  <b>Actividad economica</b>
                </v-alert>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-text-field dense type="number" v-model="familiograma.actividad_laboral"
                  label="Edad de inicio de su actividad laboral:">
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="9">
                <v-select dense v-model="familiograma.alteraciones" :items="sino"
                  label="¿Sufre usted alteraciones temporales, permanentes o agravadas del estado de salud, ocasionadas por la labor o por la exposición al medio ambiente de trabajo? ">
                </v-select>
              </v-col>
              <v-col cols="12" sm="12" md="12" v-if="familiograma.alteraciones == 'Si'">
                <v-textarea v-model="familiograma.descripcion_actividad" label="¿Cuál">
                </v-textarea>
              </v-col>

              <v-col cols="12" sm="6" md="12" class="text-center mt-9">
                <v-card-actions class="justify-center">
                <v-btn small dark color="success" class="mt-2" @click="guardarFamiliograma()">
                  Guardar actividad economica
                </v-btn>
              </v-card-actions>
              </v-col>
            </template>
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
        ocupacional: Array,
        resumen: Object
      },
      created() {
        this.form.consulta_id = this.datos.id;
        if (this.ocupacional !== undefined) {
          this.form.consulta_id = this.ocupacional[0].id_CONSULTA
        }
        this.familiograma.consulta_id = this.datos.id;
        if (this.ocupacional !== undefined) {
          this.familiograma.consulta_id = this.ocupacional[0].id_CONSULTA
        }
        // this.listar()
      },
      data() {
        return {
          form: {

          },
          familiograma: {

          },
          valid: false,
          loading: false,
          preload: false,
          sino: ['Si', 'No'],
          vinculos: ['Noviazgo', 'Esposos', 'Unión libre', 'Divorciados', 'Separados', 'Viudo', 'No aplica'],
          afectiva: ['Conflictiva', 'Dominante', 'Repulsiva', 'Distante', 'Estresante', 'Satisfactoria'],
          tipofamilia: ['Nuclear', 'Extensa', 'Monoparental', 'Biparental', 'Reconstituida',
            'Personas sin familia'
          ],
          Transgenero: ['Travesti', 'Transformista', 'Drag queen', 'Hombres trans', 'Mujeres trans'],
          escolar: ['Bueno', 'Malo', 'regular'],
          cesarea: '',
          preeclampsia: '',
          abortos: '',
          hemorragiapos: '',
          mortalidad: '',
          trabajo: '',
          cirugia: '',
          renal: '',
          diabetes: '',
          pre: '',
          hiper: '',
          poli: '',
          multi: '',
          presente: '',
          iso: '',
          ansiedad: '',
          inadecuado: '',
          repro: '',
          paridad: '',
          recien: '',
          semhemo: '',
          anemia: '',
          prolongado: '',
          arrCheckBox: [{
              id: 1,
              nombre: 'Estoy contento de pensar que puedo recurrir a mi familia en busca de ayuda cuando algo me preocupa.',
              model: 'ayuda_familia',
              options: [{
                nombre: 'SIEMPRE',
                val: 4
              }, {
                nombre: 'CASI SIEMPRE',
                val: 2,
              }, {
                nombre: 'ALGUNAS VECES',
                val: 1,
              }, {
                nombre: 'CASI NUNCA',
                val: 0
              }]
            },
            {
              id: 2,
              nombre: 'Estoy satisfecho con el modo que tiene mi familia de hablar las cosas conmigo y de cómo compartimos los problemas.',
              model: 'familia_habla_con_usted',
              options: [{
                nombre: 'SIEMPRE',
                val: 4
              }, {
                nombre: 'CASI SIEMPRE',
                val: 2
              }, {
                nombre: 'ALGUNAS VECES',
                val: 1
              }, {
                nombre: 'CASI NUNCA',
                val: 0
              }]
            },
            {
              id: 3,
              nombre: 'Me agrada pensar que mi familia acepta y apoya mis deseos de llevar a cabo nuevas actividades o seguir una nueva dirección.',
              model: 'cosas_nuevas',
              options: [{
                nombre: 'SIEMPRE',
                val: 4
              }, {
                nombre: 'CASI SIEMPRE',
                val: 2
              }, {
                nombre: 'ALGUNAS VECES',
                val: 1
              }, {
                nombre: 'CASI NUNCA',
                val: 0
              }]
            },
            {
              id: 4,
              nombre: 'Me satisface el modo que tiene mi familia de expresar su afecto y cómo responde a mis emociones, como cólera, tristeza y amor.',
              model: 'le_gusta_familia_hace',
              options: [{
                  nombre: 'SIEMPRE',
                  val: 4
                }, {
                  nombre: 'CASI SIEMPRE',
                  val: 2
                },
                {
                  nombre: 'ALGUNAS VECES',
                  val: 1
                },
                {
                  nombre: 'CASI NUNCA',
                  val: 0
                }
              ]
            },
            {
              id: 5,
              nombre: 'Me satisface la forma en que mi familia y yo pasamos el tiempo juntos.',
              model: 'le_gusta_familia_comparte',
              options: [{
                  nombre: 'SIEMPRE',
                  val: 4
                }, {
                  nombre: 'CASI SIEMPRE',
                  val: 2
                },
                {
                  nombre: 'ALGUNAS VECES',
                  val: 1
                },
                {
                  nombre: 'CASI NUNCA',
                  val: 0
                }
              ]
            },
            {
              id: 6,
              nombre: 'NOTA: si el resultado esta entre 17 y 20 es normal, entre 16-13 disfunción leve, entre 12 y 10 disfunción moderada y menor o igual a 9 es disfunción grave.',


            }
          ],
          apgarFamiliar: {
            ayuda_familia: '',
            familia_habla_con_usted: '',
            cosas_nuevas: '',
            le_gusta_familia_hace: '',
            le_gusta_familia_comparte: '',
            resultado: 0
          },

          headerApgar: [{
              text: 'id',
              value: 'id'
            },
            {
              text: 'Ayuda la familia',
              value: 'ayuda'
            },
            {
              text: 'Comparte problemas',
              value: 'comparte'
            },
            {
              text: 'Hacen cosas nueva',
              value: 'cosas'
            },
            {
              text: 'Apoyo familiar',
              value: 'apoyo'
            },
            {
              text: 'Tiempo familiar',
              value: 'tiempo'
            },
            {
              text: 'Resultado',
              value: 'resultado'
            },
            {
              text: 'Registrado por',
              value: 'user.operador.nombre'
            },
          ],
          orientacionsex: ['Heterosexual', 'Homosexual', 'Bisexual', 'Pansexual', 'Asexual', 'otro',
            'No desea contestar'
          ],
          identidadgenero: ['Hombre', 'Mujer', 'Transgenero',
            'Genero Neutro', 'Agenero', 'No desea contestar'
          ],
          escolar: ['Bueno', 'Malo', 'regular'],
          sino: ['Si', 'No'],
          sinoaplica: ['Si', 'No', 'No aplica'],
          tipoanticonceptivo: ['Inyectable trimestral', 'Inyectable mensual', 'Oral', 'DIU',
            'Implante Subdermico', 'Preservativo de Barrera( Condon y/o Diafragma)', 'Tubectomia',
            'Vasectomia', 'No vida Sexual'
          ],
          derechosexuales: ['Autonomia', 'Maternidad Planeada', 'Paternidad Planeada',
            'Interrupcion Voluntaria del Embarazo'
          ],
          tipovictimaidentigenero: ['Sexismo', 'Homofobia ', 'Transfobia'],
          tipovictimagenero: ['Explotacion Sexual', 'Explotacion Comercial (ESCI)', 'Violencia Sexual'],
          decisionesRep: ['autonomía', 'maternidad o paternidad planeada',
            'interrupción voluntaria del embarazo'
          ],
          ciclos: ['Regular', 'Irregular'],
        }
      },
      watch: {
        "familiograma.cesarea"() {
          this.calcularResultadPrenatal();
        },
        "familiograma.preeclampsia": function () {
          this.calcularResultadPrenatal();
        },
        "familiograma.abortos_recurrentes": function () {
          this.calcularResultadPrenatal();
        },
        "familiograma.hemorragia_pos": function () {
          this.calcularResultadPrenatal();
        },
        "familiograma.mortalidad_fetal": function () {
          this.calcularResultadPrenatal();
        },
        "familiograma.mortalidad_fetal": function () {
          this.calcularResultadPrenatal();
        },
        "familiograma.trabajo_parto": function () {
          this.calcularResultadPrenatal();
        },
        "familiograma.cirugia_gineco": function () {
          this.calcularResultadPrenatal();
        },
        "familiograma.renal": function () {
          this.calcularResultadPrenatal();
        },
        "familiograma.diabetes_gestacional": function () {
          this.calcularResultadPrenatal();
        },
        "familiograma.diabetes_preconcepcional": function () {
          this.calcularResultadPrenatal();
        },
        "familiograma.hiper_arterial": function () {
          this.calcularResultadPrenatal();
        },
        "familiograma.polihidramnios": function () {
          this.calcularResultadPrenatal();
        },
        "familiograma.embarazo_multiple": function () {
          this.calcularResultadPrenatal();
        },
        "familiograma.presente_frente": function () {
          this.calcularResultadPrenatal();
        },
        "familiograma.isoinmunizacion": function () {
          this.calcularResultadPrenatal();
        },
        "familiograma.ansiedad_severa": function () {
          this.calcularResultadPrenatal();
        },
        "familiograma.familiar_inadecuado": function () {
          this.calcularResultadPrenatal();
        },
        "familiograma.historia_repro": function () {
          this.calcularResultadPrenatal();
        },
        "familiograma.paridad": function () {
          this.calcularResultadPrenatal();
        },
        "familiograma.peso_recien": function () {
          this.calcularResultadPrenatal();
        },
        "familiograma.semanas_hemorragia": function () {
          this.calcularResultadPrenatal();
        },
        "familiograma.anemia": function () {
          this.calcularResultadPrenatal();
        },
        "familiograma.embarazo_prolongado": function () {
          this.calcularResultadPrenatal();
        },

        resultadoApgar(newValue) {
        if (newValue >= 17 && newValue <= 20) {
            this.tipoResultado = "mdi-information";
            this.mensajeResultado = "Normal";
            this.colorAlerta = "success";
        } else if (newValue >= 13 && newValue <= 16) {
            this.tipoResultado = "mdi-alert-rhombus";
            this.mensajeResultado = "Disfunción leve";
            this.colorAlerta = "warning";
        } else if (newValue >= 10 && newValue <= 12) {
            this.tipoResultado = "mdi-alert";
            this.mensajeResultado = "Disfunción moderada";
            this.colorAlerta = "orange";
        } else if (newValue <= 9) {
            this.tipoResultado = "mdi-alert-decagram";
            this.mensajeResultado = "Disfunción grave";
            this.colorAlerta = "error";
        }
        },
      },
      computed: {
        resultadoApgar() {
          if (this.apgarFamiliar.ayuda_familia === '' || this.apgarFamiliar.familia_habla_con_usted === '' || this
            .apgarFamiliar.cosas_nuevas === '' ||
            this.apgarFamiliar.le_gusta_familia_hace === '' || this.apgarFamiliar.le_gusta_familia_comparte === '') {
            console.log(this.apgarFamiliar.ayuda_familia, '1');
            return 0
          } else {
            console.log(this.apgarFamiliar.ayuda_familia, '2');
            return parseInt(this.apgarFamiliar.ayuda_familia + this.apgarFamiliar.familia_habla_con_usted +
              this.apgarFamiliar.cosas_nuevas + this.apgarFamiliar.le_gusta_familia_hace + this.apgarFamiliar
              .le_gusta_familia_comparte)
          }

        },
      },
      filters: {
        clasificacion(item) {
          if (parseInt(item) === 0) {
            return 'CASI NUNCA'
          } else if (parseInt(item) === 1) {
            return 'ALGUNAS VECES'
          } else if (parseInt(item) === 2) {
            return 'CASI SIEMPRE'
          } else {
            return 'SIEMPRE'
          }
        }
      },
      mounted() {
        this.obtenerDatosEcomapa();
        this.obtenerDatosApgarFamiliar()
        this.obtenerDatosFamiliograma()
        // this.listarApgar()
      },
      methods: {
        validarErrores() {
          return [];
        },
        guardar() {
          this.form.consulta_id = this.datos.id;
          if (this.ocupacional !== undefined) {
            this.form.consulta_id = this.ocupacional[0].id_CONSULTA;
          }
          this.preload = true

          this.form.medico_registra = this.$store.state.auth.usuario.id
          this.$axios.post("/antecedentes-biopsicosociales/guardarEcomapa", this.form)
            .then((res) => {
              this.$toast.success(res.data.mensaje);
              // this.limpiarFiltro();
              this.preload = false
              this.listar()
            })
            .catch((err) => {
              console.log(err);
              this.preload = false

            });
        },

        listar() {
          let data = {}
          data.consulta = this.datos.id;
          if (this.ocupacional !== undefined) {
            data.consulta = this.ocupacional[0].id_CONSULTA
          }
          this.$axios
            .post("/antecedentes-biopsicosociales/listarEcomapa", {
              consulta: data.consulta
            })
            .then((res) => {
              this.form = res.data;
            })
            .catch((err) => {
              return this.$toast.error("Error al listar antecedentes personales");
            });
        },



        guardarFamiliograma() {
          this.familiograma.consulta_id = this.datos.id;
          if (this.ocupacional !== undefined) {
            this.familiograma.consulta_id = this.ocupacional[0].id_CONSULTA;
          }
          this.preload = true

          this.familiograma.medico_registra = this.$store.state.auth.usuario.id
          this.$axios.post("/antecedentes-familiograma/guardarFamiliograma", this.familiograma)
            .then((res) => {
              this.$toast.success(res.data.mensaje);
              // this.limpiarFiltro();
              this.preload = false
              this.listarFamiliograma()
            })
            .catch((err) => {
              console.log(err);
              this.preload = false

            });
        },

        listarFamiliograma() {
          let data = {}
          data.consulta = this.datos.id;
          if (this.ocupacional !== undefined) {
            data.consulta = this.ocupacional[0].id_CONSULTA
          }
          this.$axios
            .post("/antecedentes-familiograma/listarFamiliograma", {
              consulta: data.consulta
            })
            .then((res) => {
              this.familiograma = res.data;
            })
            .catch((err) => {
              return this.$toast.error("Error al listar antecedentes personales");
            });
        },

        calcularResultadPrenatal() {
          this.familiograma.cesarea == 'Si' ? this.cesarea = 1 : this.cesarea = 0
          this.familiograma.preeclampsia == 'Si' ? this.preeclampsia = 1 : this.preeclampsia = 0
          this.familiograma.abortos_recurrentes == 'Si' ? this.abortos = 1 : this.abortos = 0
          this.familiograma.hemorragia_pos == 'Si' ? this.hemorragiapos = 1 : this.hemorragiapos = 0
          this.familiograma.mortalidad_fetal == 'Si' ? this.mortalidad = 1 : this.mortalidad = 0
          this.familiograma.trabajo_parto == 'Si' ? this.trabajo = 1 : this.trabajo = 0
          this.familiograma.cirugia_gineco == 'Si' ? this.cirugia = 1 : this.cirugia = 0
          this.familiograma.renal == 'Si' ? this.renal = 2 : this.renal = 0
          this.familiograma.diabetes_gestacional == 'Si' ? this.diabetes = 2 : this.diabetes = 0
          this.familiograma.diabetes_preconcepcional == 'Si' ? this.pre = 3 : this.pre = 0
          this.familiograma.hiper_arterial == 'Si' ? this.hiper = 2 : this.hiper = 0
          this.familiograma.polihidramnios == 'Si' ? this.poli = 2 : this.poli = 0
          this.familiograma.embarazo_multiple == 'Si' ? this.multi = 3 : this.multi = 0
          this.familiograma.presente_frente == 'Si' ? this.presente = 3 : this.presente = 0
          this.familiograma.isoinmunizacion == 'Si' ? this.iso = 3 : this.iso = 0
          this.familiograma.ansiedad_severa == 'Si' ? this.ansiedad = 1 : this.ansiedad = 0
          this.familiograma.familiar_inadecuado == 'Si' ? this.inadecuado = 1 : this.inadecuado = 0
          this.resultadoPrenatal();

        },

        resultadoPrenatal() {
          let resultado = parseInt(this.cesarea + this.preeclampsia + this.abortos + this.hemorragiapos + this
            .mortalidad + this.trabajo + this.cirugia + this.renal +
            this.diabetes + this.pre + this.hiper + this.poli + this.multi + this.presente + this.iso + this.ansiedad +
            this.inadecuado + this.repro + this.paridad +
            this.recien + this.semhemo + this.anemia + this.prolongado)
          if (resultado >= 3) {
            this.familiograma.resultadopre = 'Alto riesgo biopsicosocial'
          } else if (resultado < 3) {
            this.familiograma.resultadopre = 'Sin riesgo biopsicosocial'
          }
        },

        saveResultado() {
        this.apgarFamiliar.consulta_id = this.datos.id;
        if (this.ocupacional !== undefined) {
            this.apgarFamiliar.consulta_id = this.ocupacional[0].id_CONSULTA;
        }
        this.preload = true

        this.apgarFamiliar.medico_registra = this.$store.state.auth.usuario.id
        this.apgarFamiliar.resultado = this.resultadoApgar
        this.apgarFamiliar.interpretacion_resultado = this.mensajeResultado + ' - ' + this.resultadoApgar;

        this.$axios.post("/apgar-familiar/guardarApgar", this.apgarFamiliar)
            .then((res) => {
            this.$toast.success(res.data.mensaje);
            this.preload = false
            this.listarApgar()
            })
            .catch((err) => {
            console.log(err);
            this.preload = false
            });
        },

        // listarApgar() {
        //   let data = {}
        //   data.afiliado = this.datos.afiliado_id;
        //   if (this.ocupacional !== undefined) {
        //     data.afiliado = this.ocupacional[0].afiliado_id
        //   }
        //   this.$axios
        //     .post("/apgar-familiar/listarApgar", {
        //       afiliado: data.afiliado
        //     })
        //     .then((res) => {
        //       this.listaApgar = res.data;
        //     })
        //     .catch((err) => {
        //       return this.$toast.error("Error al listar antecedentes personales");
        //     });
        // },

        obtenerDatosEcomapa() {
          this.$axios.get(`antecedentes-biopsicosociales/obtenerDatos/${this.datos.afiliado.id}`).then(res => {
            this.form = {
              ...this.form,
              ...res.data
            };
          }).catch(error => {
            console.error('Error al obtener los datos:', error);
            this.$toast.error('Error al obtener los datos del ecomapa');
          });
        },

        obtenerDatosApgarFamiliar() {
          this.$axios.get(`apgar-familiar/obtenerDatosApgar/${this.datos.afiliado.id}`).then(res => {
            this.apgarFamiliar = {
              ...this.apgarFamiliar,
              ...res.data
            };
          }).catch(error => {
            console.error('Error al obtener los datos:', error);
            this.$toast.error('Error al obtener los datos del apgar');
          });
        },

        obtenerDatosFamiliograma() {
          this.$axios.get(`antecedentes-familiograma/obtenerDatosFamiliograma/${this.datos.afiliado.id}`).then(res => {
            this.familiograma = {
              ...this.familiograma,
              ...res.data
            };
          }).catch(error => {
            console.error('Error al obtener los datos:', error);
            this.$toast.error('Error al obtener los datos del familiograma');
          });
        }

      }
    }

  </script>
