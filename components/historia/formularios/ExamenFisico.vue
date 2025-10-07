<template>
  <div>
    <v-form ref="ExamenFisico" lazy-validation>
      <v-col cols="12" sm="12" md="12">
        <template
          v-if="![43, 45, 58, 107].includes(this.datos.cita.especialidade_id) && this.datos.cita.tipo_historia_id !== 23">
          <v-alert class="text-center" dense text border="left" type="info" icon="mdi-ruler">
            <b>MEDIDAS ANTROPOMÉTRICAS</b></v-alert>
          <v-row dense>
            <v-col xs="12" sm="6" md="1" >
              <v-text-field label="Peso (Kg)" v-model="examenF.peso" type="number" min="1" max="300"
                :rules="[v => (this.datos.cita.especialidade_id != 41 && this.datos.cita.especialidade_id != 45 && this.datos.cita.especialidade_id != 43 && this.datos.cita.especialidade_id != 42 && this.datos.cita.especialidade_id != 41 && this.datos.cita.especialidade_id != 40 && this.datos.cita.especialidade_id != 39 && this.datos.cita.tipo_historia_id != 15) ? (v >= 1 && v <= 300) || 'Valor fuera del rango permitido (1 - 300)' : []]">
              </v-text-field>
            </v-col>
            <v-col xs="12" sm="6" md="2">
              <v-text-field label="Talla (Cm)" v-model="examenF.talla" type="number"
                :rules="[v => (this.datos.cita.especialidade_id != 41 && this.datos.cita.especialidade_id != 45 && this.datos.cita.especialidade_id != 43 && this.datos.cita.especialidade_id != 42 && this.datos.cita.especialidade_id != 41 && this.datos.cita.especialidade_id != 40 && this.datos.cita.especialidade_id != 39 && this.datos.cita.tipo_historia_id != 15) ? (v >= 1 && v <= 300) || 'Valor fuera del rango permitido (1 - 300)' : []]">
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
            <v-col xs="12" sm="6" md="4">
              <v-text-field label="Clasificación" v-model="examenF.clasificacion" readonly>
              </v-text-field>
            </v-col>
            <v-col xs="12" sm="6" md="2">
              <v-text-field label="Perímetro Abdominal" type="number" v-model="examenF.perimetro_abdominal"
                :rules="[v => (
                  this.datos.cita.tipo_historia_id == 12 || this.datos.cita.tipo_historia_id == 13) ? (v >= 1 && v <= 300) || 'Valor fuera del rango permitido (1 - 300)' : []]">
              </v-text-field>
            </v-col>
            <v-col xs="12" sm="6" md="2" v-if="datos.afiliado.ciclo_vida_atencion === 'Primera Infancia (0-5 Años)'">
              <v-text-field label="Perímetro Cefálico" type="number"
                v-model="examenF.perimetro_cefalico"
                :rules="[v => (datos.afiliado.ciclo_vida_atencion === 'Primera Infancia (0-5 Años)' &&
                  this.datos.cita.especialidade_id != 43 &&
                  this.datos.cita.especialidade_id != 42 &&
                  this.datos.cita.especialidade_id != 41 &&
                  this.datos.cita.especialidade_id != 40 &&
                  this.datos.cita.especialidade_id != 39 &&
                  this.datos.cita.especialidade_id != 44 &&
                  this.datos.cita.especialidade_id != 45 &&
                  this.datos.cita.especialidade_id != 41 &&
                  this.datos.cita.tipo_historia_id != 15) ? (v >= 1 && v <= 300) || 'Valor fuera del rango permitido (1 - 300)' : []]">
              </v-text-field>
            </v-col>
            <v-col xs="12" sm="6" md="3" v-show="datos.afiliado.ciclo_vida_atencion === 'Primera Infancia (0-5 Años)' || datos.afiliado.ciclo_vida_atencion === 'Infancia (6-11 Años)'
              || datos.afiliado.ciclo_vida_atencion === 'Vejez (Mayor a 60 Años)'">
              <v-text-field label="Circunferencia brazo" type="number" v-model="examenF.circunferencia_brazo">
              </v-text-field>
            </v-col>
            <v-col xs="12" sm="6" md="4" v-if="datos.afiliado.ciclo_vida_atencion === 'Primera Infancia (0-5 Años)'">
              <v-text-field label="Clasificación peso para la talla" readonly
                v-model="examenF.clasificacion_peso_talla">
              </v-text-field>
            </v-col>
            <v-col xs="12" sm="6" md="4"
              v-show="datos.afiliado.ciclo_vida_atencion === 'Primera Infancia (0-5 Años)' || datos.afiliado.ciclo_vida_atencion === 'Infancia (6-11 Años)' || datos.afiliado.ciclo_vida_atencion === 'Adolescencia (12 A 17 Años)'">
              <v-text-field label="Clasificación talla para la edad" readonly
                v-model="examenF.clasificacion_talla_edad">
              </v-text-field>
            </v-col>
            <v-col xs="12" sm="6" md="4" v-show="datos.afiliado.ciclo_vida_atencion === 'Primera Infancia (0-5 Años)'">
              <v-text-field label="Clasificación perímetro cefálico para la edad" readonly
                v-model="examenF.clasificacion_cefalico_edad">
              </v-text-field>
            </v-col>
            <v-col xs="12" sm="6" md="4"
              v-show="datos.afiliado.ciclo_vida_atencion === 'Primera Infancia (0-5 Años)' || datos.afiliado.ciclo_vida_atencion === 'Infancia (6-11 Años)' || datos.afiliado.ciclo_vida_atencion === 'Adolescencia (12 A 17 Años)'">
              <v-text-field label="Clasificación IMC para la edad" readonly v-model="examenF.clasificacion_imc_edad">
              </v-text-field>
            </v-col>
            <v-col xs="12" sm="6" md="4" v-show="datos.afiliado.ciclo_vida_atencion === 'Primera Infancia (0-5 Años)'">
              <v-text-field label="Clasificación peso para la edad" readonly v-model="examenF.clasificacion_peso_edad">
              </v-text-field>
            </v-col>
            <!-- </v-col xs="12" sm="6" md="3">
            
            <v-col > -->
            <!-- <v-col xs="12" sm="6" md="4" v-if="datos.afiliado.ciclo_vida_atencion === 'Primera Infancia (0-5 Años)'">
              <v-select label="Peso para la talla (P/T)" :items="indicador" v-model="examenF.peso_talla">
              </v-select>
            </v-col>
            
            <v-col xs="12" sm="6" md="4"
              v-show="datos.afiliado.ciclo_vida_atencion === 'Primera Infancia (0-5 Años)' || datos.afiliado.ciclo_vida_atencion === 'Infancia (6-11 Años)' || datos.afiliado.ciclo_vida_atencion === 'Adolescencia (12 A 17 Años)'">
              <v-select label="Talla para la edad (T/E)" :items="indicadortalla" v-model="examenF.talla_edad">
              </v-select>
            </v-col>
            
            <v-col xs="12" sm="6" md="4" v-show="datos.afiliado.ciclo_vida_atencion === 'Primera Infancia (0-5 Años)'">
              <v-select label="Perímetro cefálico para la edad" :items="indicadorcefalico"
                v-model="examenF.cefalico_edad">
              </v-select>
            </v-col>
             -->
            <!-- <v-col xs="12" sm="6" md="4"
              v-show="datos.afiliado.ciclo_vida_atencion === 'Primera Infancia (0-5 Años)' || datos.afiliado.ciclo_vida_atencion === 'Infancia (6-11 Años)' || datos.afiliado.ciclo_vida_atencion === 'Adolescencia (12 A 17 Años)'">
              <v-select label="IMC para la edad" :items="indicadorimc" v-model="examenF.imc_edad">
              </v-select>
            </v-col>
             -->
            <!-- <v-col xs="12" sm="6" md="4" v-show="datos.afiliado.ciclo_vida_atencion === 'Primera Infancia (0-5 Años)'">
              <v-select label="Peso para la edad" :items="indicadorpeso" v-model="examenF.peso_edad">
              </v-select>
            </v-col>
             -->

            <v-col xs="12" sm="6" md="2" v-show="datos.cita.nombre === 'Control Prenatal (30 Min)'">
              <v-text-field label="Ganancia esperada" v-model="examenF.ganancia_esperada">
              </v-text-field>
            </v-col>
          </v-row>
        </template>

        <v-divider></v-divider>

        <!-- <v-col cols="12" sm="6" md="6">
          <graficas :datos="datos"></graficas>
        </v-col> -->

        <template
          v-if="![42, 43, 44, 45, 58, 41, 107, 23].includes(this.datos.cita.especialidade_id) && this.datos.cita.tipo_historia_id !== 23">
          <v-alert class="text-center" dense text border="left" type="info" icon="mdi-clipboard-pulse">
            <b>SIGNOS VITALES</b></v-alert>

          <v-row dense v-show="datos.cita.especialidad.nombre !== 'Quimica Farmacologica'">
            <v-col xs="12" sm="6" md="3" v-if="datos.afiliado.edad_cumplida >= 3">
              <v-text-field label="Presión Arterial Sistólica" dense type="number" v-model="examenF.presion_sistolica"
                :rules="[v => (this.datos.afiliado.edad_cumplida >= 3 && this.datos.cita.especialidade_id != 45 && this.datos.cita.especialidade_id != 44 && this.datos.cita.especialidade_id != 43 && this.datos.cita.especialidade_id != 42 && this.datos.cita.tipo_historia_id != 15) ? (v >= 10 && v <= 300) || 'Valor fuera del rango permitido (10 - 300)' : []]">
              </v-text-field>
            </v-col>
            <v-col xs="12" sm="6" md="2" v-if="datos.afiliado.edad_cumplida >= 3">
              <v-text-field label="Presión Arterial Diastólica" dense type="number" v-model="examenF.presion_diastolica"
                :rules="[v => (this.datos.afiliado.edad_cumplida >= 3 && this.datos.cita.especialidade_id != 45 && this.datos.cita.especialidade_id != 44 && this.datos.cita.especialidade_id != 43 && this.datos.cita.especialidade_id != 42 && this.datos.cita.tipo_historia_id != 15) ? (v >= 10 && v <= 150) || 'Valor fuera del rango permitido (10 - 150)' : []]">
              </v-text-field>
            </v-col>

            <v-col xs="12" sm="6" md="3" v-if="datos.afiliado.edad_cumplida >= 3">
              <v-text-field dense label="Presión Arterial Media" type="number" v-model="examenF.presion_arterial_media"
                readonly></v-text-field>
            </v-col>
            <v-col xs="12" sm="6" md="3">
              <v-text-field dense label="Frecuencia cardiaca" type="number" v-model="examenF.frecuencia_cardiaca"
                :rules="[v => (this.datos.cita.especialidade_id != 45 && this.datos.cita.especialidade_id != 44 && this.datos.cita.especialidade_id != 43 && this.datos.cita.especialidade_id != 42 && this.datos.cita.tipo_historia_id != 15) ? (v >= 30 && v <= 300) || 'Valor fuera del rango permitido (30 - 300)' : []]">
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
                :rules="[v => (this.datos.cita.especialidade_id != 45 && this.datos.cita.especialidade_id != 44 && this.datos.cita.especialidade_id != 43 && this.datos.cita.especialidade_id != 42 && this.datos.cita.tipo_historia_id != 15) ? (v > 30 && v < 100) || 'Valor fuera del rango permitido (30 - 100)' : []]">
              </v-text-field>
            </v-col>

            <v-col xs="12" sm="6" md="3">
              <v-text-field dense label="Fracción inspiratoria de oxígeno" type="number" v-model="examenF.fio">
              </v-text-field>
            </v-col>
          </v-row>
        </template>
        <template v-if="this.datos.cita.especialidade_id !== 43">
          <v-alert class="text-center" dense text border="left" type="info" icon="mdi-human-male-height-variant"
            v-show="datos.cita.especialidad.nombre !== 'Quimica Farmacologica'">
            <b>EXAMEN FÍSICO</b></v-alert>
          <v-col xs="12" sm="12" md="12">
            <v-textarea dense outlined label="Aspecto General" v-model="examenF.condicion_general" required
              :rules="[v => !!v || 'El campo Aspecto General es requerido', v => (v && v.length >= 15) || 'El campo debe tener al menos 25 caracteres']">
            </v-textarea>
          </v-col>

          <template v-if="this.datos.cita.tipo_historia_id !== 23">
            <v-col cols="12" sm="12" md="12">
              <v-textarea dense label="Cabeza y cuello" outlined v-model="examenF.cabeza_cuello" auto-grow></v-textarea>
            </v-col>

            <v-col xs="12" sm="12" md="12">
              <v-textarea dense label="Abdomen:" v-model="examenF.abdomen" auto-grow outlined></v-textarea>
            </v-col>

            <v-col cols=12 sm=6 md="12">

              <v-textarea dense label="Cardiorespiratorio" v-model=examenF.examen_cardiorespiratorio auto-grow outlined>
              </v-textarea>
            </v-col>
            <v-col cols=12 sm=6 md="12">
              <v-textarea dense label="Genitales" v-model=examenF.examen_genitales auto-grow outlined>
              </v-textarea>
            </v-col>
            <v-col xs="12" sm="6" md="12">
              <v-textarea dense label="Extremidades" v-model="examenF.examen_extremidades" auto-grow outlined>
              </v-textarea>
            </v-col>
            <v-col xs="12" sm="6" md="12">
              <v-textarea dense label="Piel y anexos" v-model="examenF.piel_anexos" auto-grow outlined>
              </v-textarea>
            </v-col>
            <v-col xs="12" sm="6" md="12">
              <v-textarea dense label="Neurológico" v-model="examenF.neurologico" auto-grow outlined>
              </v-textarea>
            </v-col>

            <v-row dense justify="center" v-if="diabetesConsulta = true && this.datos.cita.tipo_historia_id == 12">
              <v-col cols=12 sm=12 md="12">
                <v-alert text dense color="success" border="left" class="text-center" icon="mdi-information">
                  <b>PIE DIABÉTICO</b>
                </v-alert>
              </v-col>
              <v-col class="d-flex flex-column align-center">
                <v-radio-group row v-model="examenF.poseePieDiabetico">
                  <v-radio label="Si" :value="true"></v-radio>
                  <v-radio label="No" :value="false"></v-radio>
                </v-radio-group>
              </v-col>
            </v-row>

            <!-- <v-col cols=12 sm=6 md="12" v-show="datos.cita.tipo_historia_id ==8 || datos.cita.tipo_historia_id == 9">
            <v-autocomplete label="Whooley para tamizacion de depresion" v-model="examenF.tamizacion_depresion" outlined
              dense :items="cuestionarioGAD2">
            </v-autocomplete>
          </v-col>
          <v-col cols=12 sm=6 md="12" v-show="datos.cita.tipo_historia_id ==8 || datos.cita.tipo_historia_id == 9">
            <v-autocomplete outlined label="Cuestionario GAD-2 para tamizacion de los trastornos de ansiedad"
              v-model="examenF.tamizacion_trastornos_ansiedad" :items="cuestionarioGAD2" dense>
            </v-autocomplete>
          </v-col>
          <v-col cols=12 sm=6 md="12" v-show="datos.cita.tipo_historia_id == 9">
            <v-autocomplete label="Test (AUDIT)" v-model="examenF.test_audit" outlined :items="cuestionarioGAD2" dense>
            </v-autocomplete>
          </v-col> -->


            <v-col cols="12" md="12" sm="12">
              <whooley v-if="examenF.tamizacion_depresion === 'Si'" :datos="datos" />
            </v-col>

            <v-col cols="12" md="12" sm="12">
              <Cuestionario v-if="examenF.tamizacion_trastornos_ansiedad === 'Si'" :datos="datos" />
            </v-col>

            <v-col cols="12" md="12" sm="12">
              <testAudit v-if="examenF.test_audit === 'Si'" tipoTest="AUDIT" :datos="datos" />
            </v-col>

          </template>
        </template>

        <!-- <v-col cols="12" md="12" sm="12">
            <mental :datos="datos"></mental>
          </v-col> -->


        <!-- <v-row v-show="[5, 6, 7].includes(datos.cita.tipo_historia_id)">
          <v-col xs="12" sm="12" md="12" v-show="datos.cita.especialidad.nombre !== 'Quimica Farmacologica'"
            v-if="datos.afiliado.ciclo_vida_atencion === 'Primera Infancia (0-5 Años)' || datos.afiliado.ciclo_vida_atencion === 'Infancia (6-11 Años)' || datos.afiliado.ciclo_vida_atencion === 'Adolescencia (12 A 17 Años)'">
            <v-alert class="text-center" dense text outlined type="info" icon="mdi-book-open-page-variant">
              <b>Valoración del desarrollo</b></v-alert>
          </v-col>
          <v-row row wrap>
            <v-col xs="12" sm="6" md="6"
              v-show="datos.afiliado.ciclo_vida_atencion === 'Primera Infancia (0-5 Años)' || datos.afiliado.ciclo_vida_atencion === 'Infancia (6-11 Años)' || datos.afiliado.ciclo_vida_atencion === 'Adolescencia (12 A 17 Años)' && datos.cita.tipo_historia_id !==5">
              <v-select v-model="examenF.cuidado" :items="adecuada"
                label="Percepción de los cuidadores del desarrollo del niño:">
              </v-select>
            </v-col>
            <v-col xs="12" sm="6" md="6"
              v-show="datos.afiliado.ciclo_vida_atencion === 'Primera Infancia (0-5 Años)' || datos.afiliado.ciclo_vida_atencion === 'Infancia (6-11 Años)' || datos.afiliado.ciclo_vida_atencion === 'Adolescencia (12 A 17 Años)' && datos.cita.tipo_historia_id !==5">
              <v-text-field type="number" v-model="examenF.escala_desarrollo"
                label="Resultado Escala Abreviada de Desarrollo-3:">
              </v-text-field>
            </v-col>
            <v-col xs="12" sm="6" md="6"
              v-show="datos.afiliado.ciclo_vida_atencion === 'Primera Infancia (0-5 Años)' || datos.afiliado.ciclo_vida_atencion === 'Infancia (6-11 Años)' || datos.afiliado.ciclo_vida_atencion === 'Adolescencia (12 A 17 Años)' && datos.cita.tipo_historia_id !==5">
              <v-text-field type="number" v-model="examenF.autismo"
                label="Resultado Test m-Chat (Tamizaje de Autismo):">
              </v-text-field>
            </v-col>
            <v-col xs="12" sm="6" md="6"
              v-show="datos.afiliado.ciclo_vida_atencion === 'Primera Infancia (0-5 Años)' || datos.afiliado.ciclo_vida_atencion === 'Infancia (6-11 Años)' || datos.afiliado.ciclo_vida_atencion === 'Adolescencia (12 A 17 Años)'">
              <v-text-field v-model="examenF.rendimiento_escolar" label="Rendimiento escolar:">
              </v-text-field>
            </v-col>
            <v-col xs="12" sm="6" md="6"
              v-show="datos.afiliado.ciclo_vida_atencion === 'Primera Infancia (0-5 Años)' || datos.afiliado.ciclo_vida_atencion === 'Infancia (6-11 Años)' || datos.afiliado.ciclo_vida_atencion === 'Adolescencia (12 A 17 Años)' && datos.cita.tipo_historia_id !==5">
              <v-text-field v-model="examenF.test_figura_humana"
                label="Resultado Test de la figura humana Goodenough Harris (En caso de alteraciones del rendimiento escolar):">
              </v-text-field>
            </v-col>
            <v-col xs="12" sm="6" md="6"
              v-show="datos.afiliado.ciclo_vida_atencion === 'Primera Infancia (0-5 Años)' || datos.afiliado.ciclo_vida_atencion === 'Infancia (6-11 Años)' || datos.afiliado.ciclo_vida_atencion === 'Adolescencia (12 A 17 Años)'">
              <v-select v-model="examenF.actividades" :items="sino"
                label="Demuestren que sus actividades tienen un propósito:">
              </v-select>
            </v-col>
            <v-col xs="12" sm="6" md="6"
              v-show="datos.afiliado.ciclo_vida_atencion === 'Primera Infancia (0-5 Años)' || datos.afiliado.ciclo_vida_atencion === 'Infancia (6-11 Años)' || datos.afiliado.ciclo_vida_atencion === 'Adolescencia (12 A 17 Años)'">
              <v-select v-model="examenF.autocontrol" :items="sino" label="Ejercen autocontrol :">
              </v-select>
            </v-col>
            <v-col xs="12" sm="6" md="6"
              v-show="datos.afiliado.ciclo_vida_atencion === 'Primera Infancia (0-5 Años)' || datos.afiliado.ciclo_vida_atencion === 'Infancia (6-11 Años)' || datos.afiliado.ciclo_vida_atencion === 'Adolescencia (12 A 17 Años)'">
              <v-select v-model="examenF.comportamientos" :items="sino"
                label="Exhiben comportamientos fiables, consistentes y pensados :">
              </v-select>
            </v-col>
            <v-col xs="12" sm="6" md="6"
              v-show="datos.afiliado.ciclo_vida_atencion === 'Primera Infancia (0-5 Años)' || datos.afiliado.ciclo_vida_atencion === 'Infancia (6-11 Años)' || datos.afiliado.ciclo_vida_atencion === 'Adolescencia (12 A 17 Años)'">
              <v-select v-model="examenF.auto_eficacia" :items="sino" label="Expresan autoeficacia positiva :">
              </v-select>
            </v-col>
            <v-col xs="12" sm="6" md="6"
              v-show="datos.afiliado.ciclo_vida_atencion === 'Primera Infancia (0-5 Años)' || datos.afiliado.ciclo_vida_atencion === 'Infancia (6-11 Años)' || datos.afiliado.ciclo_vida_atencion === 'Adolescencia (12 A 17 Años)'">
              <v-select v-model="examenF.independencia" :items="sino" label="Demuestran independencia:">
              </v-select>
            </v-col>
            <v-col xs="12" sm="6" md="6"
              v-show="datos.afiliado.ciclo_vida_atencion === 'Primera Infancia (0-5 Años)' || datos.afiliado.ciclo_vida_atencion === 'Infancia (6-11 Años)' || datos.afiliado.ciclo_vida_atencion === 'Adolescencia (12 A 17 Años)'">
              <v-select v-model="examenF.actividades_proposito" :items="sino"
                label="Demuestran capacidad de resolución de problemas :">
              </v-select>
            </v-col>
            <v-col xs="12" sm="6" md="6"
              v-show="datos.afiliado.ciclo_vida_atencion === 'Primera Infancia (0-5 Años)' || datos.afiliado.ciclo_vida_atencion === 'Infancia (6-11 Años)' || datos.afiliado.ciclo_vida_atencion === 'Adolescencia (12 A 17 Años)'">
              <v-select v-model="examenF.control_interno" :items="sino" label="Exhiben un locus de control interno :">
              </v-select>
            </v-col>
            <v-col xs="12" sm="6" md="6"
              v-if="datos.afiliado.ciclo_vida_atencion === 'Primera Infancia (0-5 Años)' || datos.afiliado.ciclo_vida_atencion === 'Infancia (6-11 Años)' || datos.afiliado.ciclo_vida_atencion === 'Adolescencia (12 A 17 Años)'">
              <v-select v-model="examenF.funciones_ejecutivas" :items="sino" label="Funciones ejecutivas :">
              </v-select>
            </v-col>
            <v-col xs="12" sm="6" md="6"
              v-if="datos.afiliado.ciclo_vida_atencion === 'Primera Infancia (0-5 Años)' || datos.afiliado.ciclo_vida_atencion === 'Infancia (6-11 Años)' || datos.afiliado.ciclo_vida_atencion === 'Adolescencia (12 A 17 Años)'">
              <v-select v-model="examenF.identidad" :items="sino" label="Identidad :">
              </v-select>
            </v-col>
            <v-col xs="12" sm="6" md="6"
              v-if="datos.afiliado.ciclo_vida_atencion === 'Primera Infancia (0-5 Años)' || datos.afiliado.ciclo_vida_atencion === 'Infancia (6-11 Años)' || datos.afiliado.ciclo_vida_atencion === 'Adolescencia (12 A 17 Años)'">
              <v-select v-model="examenF.valoracion_identidad" :items="sino"
                label="Resultado de instrumento de valoración de la identidad :">
              </v-select>
            </v-col>
            <v-col xs="12" sm="6" md="6"
              v-if="datos.afiliado.ciclo_vida_atencion === 'Primera Infancia (0-5 Años)' || datos.afiliado.ciclo_vida_atencion === 'Infancia (6-11 Años)' || datos.afiliado.ciclo_vida_atencion === 'Adolescencia (12 A 17 Años)'">
              <v-select v-model="examenF.autonomia" :items="sino" label="Autonomía :">
              </v-select>
            </v-col>
            <v-col xs="12" sm="6" md="6"
              v-if="datos.afiliado.ciclo_vida_atencion === 'Primera Infancia (0-5 Años)' || datos.afiliado.ciclo_vida_atencion === 'Infancia (6-11 Años)' || datos.afiliado.ciclo_vida_atencion === 'Adolescencia (12 A 17 Años)'">
              <v-select v-model="examenF.valoracion_autonomia" :items="sino"
                label="Resultado de instrumento valoración de la autonomía :">
              </v-select>
            </v-col>
          </v-row>
        </v-row> -->
        <!-- <v-row v-show="!([1, 12, 13, 6, 7, 20, 23, 32, 35].includes(datos.cita.tipo_historia_id))" dense>
          <v-col xs="12" sm="12" md="12"
            v-show="datos.cita.especialidad.nombre !== 'Quimica Farmacologica' && datos.cita.nombre !== 'Consulta   Individual De Riesgo Cardiovascular (30 Min)'">
            <v-alert class="text-center" dense text border="left" type="info" icon="mdi-ear-hearing">
              <b>Valoración salud auditiva y
                comunicativa</b></v-alert>
          </v-col>
          <v-container fluid>
            <v-row dense>
              <v-col xs="12" sm="6" md="4">
                <v-text-field dense v-model="examenF.funciones" label="Funciones de la articulación, voz y habla:">
                </v-text-field>
              </v-col>
              <v-col xs="12" sm="6" md="4">
                <v-text-field dense v-model="examenF.desempenio_comunicativo" label="Desempeño comunicativo:">
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4" v-show="datos.cita.tipo_historia_id == 6">
                <v-text-field dense label="Tamizaje auditivo neonatal" v-model="examenF.tamizaje_auditivo_neonatal">
                </v-text-field>
              </v-col>
              <v-col xs="12" sm="6" md="12">
                <v-text-field dense v-model="examenF.factores_oido"
                  label="lista de chequeo de factores de riesgo de las enfermedades del oído, alteraciones auditivas, vestibulares y de la comunicación:">
                </v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-row> -->
        <!-- <v-col cols="12" sm="12" md="12"
          v-show="datos.cita.especialidad.nombre !== 'Quimica Farmacologica' && !([1, 12, 13, 6, 7, 20, 23, 32].includes(datos.cita.tipo_historia_id))">
          <v-alert class="text-center" dense text border="left" type="info" icon="mdi-pistol">
            <b>Valoración psicosocial</b></v-alert>
        </v-col>
        <v-container fluid>
          <v-row dense
            v-show="datos.cita.especialidad.nombre !== 'Quimica Farmacologica' && !([1, 12, 13, 6, 7, 20, 23, 32].includes(datos.cita.tipo_historia_id))">
            <v-col xs="12" sm="6" md="6">
              <v-select dense v-model="examenF.violencia_mental" :items="sino" label="Violencia :">
              </v-select>
            </v-col>
            <v-col xs="12" sm="6" md="6">
              <v-select dense v-model="examenF.violencia_conflicto" :items="sino" label="Violencia conflicto armado:">
              </v-select>
            </v-col>
            <v-col xs="12" sm="6" md="6"
              v-if="datos.afiliado.edad_cumplida >= 12 && datos.afiliado.edad_cumplida <= 50">
              <v-select dense v-model="examenF.violencia_sexual" :items="sino" label="Violencia sexual:">
              </v-select>
            </v-col>
            <v-col xs="12" sm="6" md="6"
              v-if="datos.afiliado.edad_cumplida >= 12 && datos.afiliado.edad_cumplida <= 50">
              <v-select dense v-model="examenF.lesiones_auto_inflingidas" :items="sino"
                label="Lesiones autoinflingidas:">
              </v-select>
            </v-col> -->
            <!-- <v-col xs="12" sm="6" md="12"
            v-show="datos.ciclo_vida_atencion === 'Primera Infancia (0-5 Años)' || datos.ciclo_vida_atencion === 'Infancia (6-11 Años)' || datos.ciclo_vida_atencion === 'Adolescencia (12 A 17 Años)'">
            <v-select v-model="examenF.riesgos_mentales_ninos" :items="sino"
              label="Tamizaje Reporting Questionnare for children (RQC) Riesgos mentales en niños:">
            </v-select>
          </v-col> -->

          <!-- </v-row> -->
        <!-- </v-container> -->
      </v-col>
    </v-form>
  </div>
</template>
<script>
import _ from "lodash";
import Cuestionario from "~/components/historia/formularios/cuestionarioGAD-2.vue";
import whooley from "~/components/historia/formularios/whooley.vue";
import testAudit from "~/components/historia/formularios/testAudit.vue";
import mental from "~/components/historia/formularios/miniMental.vue";
import mchat from "~/components/historia/formularios/testMchat.vue";
import graficas from "~/components/historia/formularios/graficosMedidas.vue";
import { mapState, mapActions, mapGetters } from 'vuex';

export default {
  name: "ExamenFisico",
  components: {
    Cuestionario,
    whooley,
    testAudit,
    mental,
    mchat,
    graficas
  },
  name: "",
  props: ['datos', 'resumen'],
  data() {
    return {
      diabetesConsulta: false,
      ejecutando: false,
      graficasHistoria: true,
      edadMeses: null,
      fecha_nacimiento: this.datos.afiliado.fecha_nacimiento,
      valoresPesoTalla: [],
      historicoExamen: [],
      Rolcuidador: '',
      cuidador: ['Si', 'No'],
      cuestionarioGAD2: ['Si', 'No'],
      examenF: {
        poseePieDiabetico: null,
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
        perimetro_cefalico: '',
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
        fio: '0.21',
        aspecto_general: null,
        piel_faneras: null,
        cabeza: null,
        cara: null,
        ojos: null,
        visual_nino: null,
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
        tamizaje_agudeza_visual: null,
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
        desgarro_perine: null,
        agudeza_visual_ojo_izquierdo: null,
        agudeza_visual_ojo_derecho: null,
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
    examenF: {
      deep: true,
      handler(newVal) {
        this.calcularIMC();
        this.updateExamenF(newVal);
      },
    },
    "examenF.peso": _.debounce(function () {
      this.calcularASC();
      this.verificarCampos();
    }, 700),
    "examenF.talla": _.debounce(function () {
      this.calcularASC();
      this.verificarCampos();
    }, 700),
    "examenF.perimetro_cefalico": _.debounce(function () {
      this.verificarCampos();
    }, 700),

    calcularMediaPresion() {
      this.examenF.presion_arterial_media =
        (parseInt(this.examenF.presion_diastolica) * 2 +
          parseInt(this.examenF.presion_sistolica)) /
        3;
      this.examenF.presion_arterial_media = Number.parseFloat(
        this.examenF.presion_arterial_media
      ).toFixed(1);
    },
  },
    mounted() {
      this.obtenerDatosValoracion();
      this.obtenerDatosDiabetes();
      const datosExamenFisico = this.obtenerDatosPorConsulta(this.datos.id, 'Historia/Models/HistoriaClinica', 'historia/formularios/ExamenFisico');

      if (datosExamenFisico) {
        this.examenF = { ...datosExamenFisico }
      }
      this.edadMeses = this.calcularEdadEnMeses(this.fecha_nacimiento);
    },
    computed: {
      ...mapGetters('historiaClinica', ['obtenerDatosPorConsulta']),

      datosGraficas() {
        this.edadMeses = (this.edadMeses > 60 && this.edadMeses <= 72) 
        ? 60 
        : this.edadMeses;

        return {
          sexo: this.datos.afiliado.sexo,
          peso: this.examenF.peso,
          altura: this.examenF.talla,
          imc: this.examenF.imc,
          perimetro_cefalico: this.examenF.perimetro_cefalico,
          afiliadoId: this.datos.afiliado.id,
          edad: this.edadMeses,
          graficasHistoria: this.graficasHistoria,
          fechaNacimiento: this.fecha_nacimiento
        };
      }
    },
    methods: {
      ...mapActions('app', ['setPreload']),
      ...mapActions('medidas', ['updateExamenF']),

      verificarCampos() {
      if ((this.examenF.imc && (this.datos.afiliado.ciclo_vida_atencion === 'Adolescencia (12 A 17 Años)' || this.datos.afiliado.ciclo_vida_atencion === 'Infancia (6-11 Años)')) || (this.examenF.imc && this.examenF.perimetro_cefalico && this.datos.afiliado.ciclo_vida_atencion === 'Primera Infancia (0-5 Años)')) {
        this.ejecutarTodasLasGraficas();
      }
    },

      obtenerDatos() {
      const { poseePieDiabetico, ...resto } = this.examenF;
      return { modelo: "Historia", datos: resto };
    },
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
        return this.$refs.ExamenFisico.validate();
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
      generarGraficaPesoTalla() {
        this.loading = true;
        const datosGrafica = this.datosGraficas;
        this.$axios.post('graficas-oms/generarGraficaPesoTalla', datosGrafica)
          .then(res => {
            this.examenF.clasificacion_peso_talla = res.data;
          })
          .catch(error => {
            this.$toast.error(error);
          })
          .finally(() => {
            this.loading = false;
          });
      },

      generarGraficaTallaEdad() {
        this.loading = true;
        const datosGrafica = this.datosGraficas;
        this.$axios.post('graficas-oms/generarGraficaTallaEdad', datosGrafica)
          .then(res => {
            this.examenF.clasificacion_talla_edad = res.data;
          })
          .catch(error => {
            this.$toast.error(error);
          })
          .finally(() => {
            this.loading = false;
          });
      },
      generarGraficaPerimetroCefalico() {
        this.loading = true;
        const datosGrafica = this.datosGraficas;
        this.$axios.post('graficas-oms/generarGraficaPerimetroCefalico', datosGrafica)
          .then(res => {
            this.examenF.clasificacion_cefalico_edad = res.data;
          })
          .catch(error => {
            this.$toast.error(error);
          })
          .finally(() => {
            this.loading = false;
          });
      },
      generarGraficaIMC() {
        this.loading = true;
        const datosGrafica = this.datosGraficas;
        this.$axios.post('graficas-oms/generarGraficaIMC', datosGrafica)
          .then(res => {
            this.examenF.clasificacion_imc_edad = res.data;
          })
          .catch(error => {
            this.$toast.error(error);
          })
          .finally(() => {
            this.loading = false;
          });
      },
      generarGraficaPesoEdad() {
        this.loading = true;
        const datosGrafica = this.datosGraficas;
        this.$axios.post('graficas-oms/generarGraficaPesoEdad', datosGrafica)
          .then(res => {
            this.examenF.clasificacion_peso_edad = res.data;
          })
          .catch(error => {
            this.$toast.error(error);
          })
          .finally(() => {
            this.loading = false;
          });
      },
      calcularEdadEnMeses(fecha_nacimiento) {
        const nacimiento = new Date(fecha_nacimiento);
        const hoy = new Date();

        let anios = hoy.getFullYear() - nacimiento.getFullYear();
        let meses = hoy.getMonth() - nacimiento.getMonth();
        let dias = hoy.getDate() - nacimiento.getDate();

        if (dias < 0) {
          meses--;
        }

        const edadEnMeses = anios * 12 + meses;
        return edadEnMeses >= 0 ? edadEnMeses : 0;
      },
      async ejecutarTodasLasGraficas() {
        if (this.ejecutando) return;
        this.ejecutando = true;
        this.setPreload(true);
        try {
          if(this.datos.afiliado.ciclo_vida_atencion === 'Primera Infancia (0-5 Años)'){
            await Promise.all([
              this.generarGraficaPesoTalla(),
              this.generarGraficaTallaEdad(),
              this.generarGraficaPerimetroCefalico(),
              this.generarGraficaIMC(),
              this.generarGraficaPesoEdad()
            ]);
          }else {
              await Promise.all([
              this.generarGraficaTallaEdad(),
              this.generarGraficaIMC(),
            ]);
          }
        } catch (error) {
          this.$toast.error('Error al generar reporte puntuación Z');
        } finally {
          this.setPreload(false);
          this.ejecutando = false;
        }
      },
      obtenerDatosDiabetes() {
      let afiliado_id = this.datos.afiliado.id;
      this.$axios.get(`/antecedentes-personales/obtenerDiabetes/${afiliado_id}`)
        .then((res) => {
          this.diabetesConsulta = res.data;
        })
        .catch((err) => {
          return this.$toast.error("Error al generar información de diabetes");
        })
    },
    },
  }
</script>
