<template>
  <div>
      <v-alert prominent type="info" text>
        La encuesta del perfil sociodemográfico es utilizada como insumo para identificar, prevenir y
        monitorear el diagnóstico de salud y riesgo psicosocial de los trabajadores.
      </v-alert>
      <form @submit.prevent="guardarPerfil">
        <v-card-text>
          <v-container fluid>
            <v-row dense>
              <v-col cols="12" sm="4" md="4">
                <v-select dense v-model="perfil.turno_trabajo" :items="turnos_trabajo"
                  :error-messages="errors.turno_trabajo">
                </v-select>
                <b style="text-align: justify">Turno de trabajo</b>
              </v-col>
              <v-col cols="12" sm="4" md="4">
                <v-select dense v-model="perfil.numero_personas_depende" :items="personas_depende"
                  :error-messages="errors.numero_personas_depende">
                </v-select>
                <b style="text-align: justify">Número de personas que dependen económicamente de usted (Aunque no vivan con usted)</b>
              </v-col>
              <v-col cols="12" sm="4" md="4">
                <v-select dense v-model="perfil.numero_miembros_hogar" :items="miembros_hogar"
                  :error-messages="errors.numero_miembros_hogar">
                </v-select>
                <b style="text-align: justify">¿Cuántos miembros conforman el hogar ? (Incluyéndose)</b>
              </v-col>
              <v-col cols="12" sm="4" md="4">
                <v-select dense v-model="perfil.numero_hijos" :items="hijos" :error-messages="errors.numero_hijos">
                </v-select>
                <b style="text-align: justify">Número de hijos</b>
              </v-col>
              <v-col cols="12" sm="4" md="4" v-if="perfil.numero_hijos > 0">
                <v-select dense v-model="perfil.rango_edad_hijos" :items="hijos_rangos_edades"
                  :error-messages="errors.rango_edad_hijos">
                </v-select>
                <b style="text-align: justify">Rango de edades hijos</b>
              </v-col>
              <v-col cols="12" sm="4" md="4" v-if="perfil.rango_edad_hijos === 'Otros'">
                <v-text-field dense v-model="perfil.otros_rango_edad_hijos"
                  :error-messages="errors.otros_rango_edad_hijos">
                </v-text-field>
                <b style="text-align: justify">Especifique el rango edades hijos</b>
              </v-col>
              <v-col cols="12" sm="4" md="4">
                <v-checkbox dense v-model="perfil.tiene_mascota" label="Tiene mascota">
                </v-checkbox>
              </v-col>
              <v-col cols="12" sm="4" md="4" v-if="perfil.tiene_mascota == true">
                <v-text-field dense v-model="perfil.cuantas_cuales_mascotas"
                  :error-messages="errors.cuantas_cuales_mascotas">
                </v-text-field>
                <b style="text-align: justify">¿Cuántas y cual(es) animal(es)?</b>
              </v-col>
              <v-col cols="12" sm="4" md="4">
                <v-select dense v-model="perfil.tipo_vivienda" :items="tipos_vivienda"
                  :error-messages="errors.tipo_vivienda">
                </v-select>
                <b style="text-align: justify">Tipo de vivienda</b>
              </v-col>
              <v-col cols="12" sm="4" md="4">
                <v-select dense v-model="perfil.estrato_socioeconomico" :items="estratos_socioeconomico"
                  :error-messages="errors.estrato_socioeconomico">
                </v-select>
                <b style="text-align: justify">Estrato socioeconómico</b>
              </v-col>
              <v-col cols="12" sm="4" md="4">
                <v-select dense v-model="perfil.servicios_publicos" :items="servicios_publicos_items"
                  :error-messages="errors.servicios_publicos">
                </v-select>
                <b style="text-align: justify">¿Su vivienda tiene los siguientes servicios públicos?</b>
              </v-col>
              <v-col cols="12" sm="4" md="4">
                <v-select dense v-model="perfil.seguridad_orden_publico" :items="seguridad_orden_publico_items"
                  :error-messages="errors.seguridad_orden_publico">
                </v-select>
                <b style="text-align: justify">¿Cómo califica la seguridad y orden público del lugar donde vive?</b>
              </v-col>
              <v-col cols="12" sm="4" md="4">
                <v-select dense v-model="perfil.medio_transporte" :items="medio_transporte_items"
                  :error-messages="errors.medio_transporte">
                </v-select>
                <b style="text-align: justify">¿Cuenta con alguno de los siguientes medios de transporte propio?. (si su respuesta es 'Otros'
                  debe especificar cual)</b>
              </v-col>
              <v-col cols="12" sm="4" md="4" v-if="perfil.medio_transporte == 'Otros'">
                <v-text-field dense v-model="perfil.otros_medio_transporte"
                  :error-messages="errors.otros_medio_transporte">
                </v-text-field>
                <b style="text-align: justify">Especifique medio de transporte</b>
              </v-col>
              <v-col cols="12" sm="4" md="4">
                <v-select dense v-model="perfil.tiempo_transporte" :items="tiempo_transporte_items"
                  :error-messages="errors.tiempo_transporte">
                </v-select>
                <b style="text-align: justify">Indique aproximadamente cuanto tiempo invierte transportándose diario a su lugar de trabajo
                  (Ida y regreso)</b>
              </v-col>
              <v-col cols="12" sm="4" md="4">
                <v-select dense v-model="perfil.promedio_ingresos_mensuales" :items="promedio_ingresos_mensuales_items"
                  :error-messages="errors.promedio_ingresos_mensuales">
                </v-select>
                <b style="text-align: justify">Promedio de ingresos mensuales (salario, primas legales, extralegales, comisiones, bonos).
                  (SMLVM: Salario mínimo legal vigente mensual)</b>
              </v-col>
              <v-col cols="12" sm="4" md="4">
                <v-select dense v-model="perfil.promedio_ingresos_mensuales_extralaborales"
                  :items="promedio_ingresos_mensuales_extralaborales_items"
                  :error-messages="errors.promedio_ingresos_mensuales_extralaborales">
                </v-select>
                <b style="text-align: justify">¿Cuánto suman sus ingresos extralaborales mensuales?</b>
              </v-col>
              <v-col cols="12" sm="4" md="4">
                <v-select dense v-model="perfil.personas_aportan_hogar" :items="personas_aportan_hogar_items"
                  :error-messages="errors.personas_aportan_hogar">
                </v-select>
                <b style="text-align: justify">¿Cuántas Personas Diferentes a Usted, Aportan Económicamente para el Sostenimiento del hogar ?
                </b>
              </v-col>
              <v-col cols="12" sm="4" md="4" v-if="this.perfil.id == null">
                <v-autocomplete dense v-model="perfil.instituciones_ahorro" :items="instituciones_ahorro_items"
                  item-text="name" item-value="id" chips deletable-chips multiple small-chips
                  :error-messages="errors.instituciones_ahorro">
                </v-autocomplete>
                <b style="text-align: justify">¿A través de qué instituciones ahorra? (se pueden seleccionar varias opciones). (si su
                  respuesta es 'Otros' debe especificar ¿cual?.)
                </b>
              </v-col>
              <v-col cols="12" sm="4" md="4" v-if="this.perfil.id > -1">
                <v-text-field dense v-model="perfil.instituciones_ahorro" :items="instituciones_ahorro_items"
                  item-text="name" item-value="id" chips deletable-chips multiple
                  :error-messages="errors.instituciones_ahorro">
                </v-text-field>
                <b style="text-align: justify">¿A través de qué instituciones ahorra? (se pueden seleccionar varias opciones). (si su
                  respuesta es 'Otros' debe especificar ¿cual?.)
                </b>
              </v-col>
              <v-col cols="12" sm="4" md="4" v-if="perfil.instituciones_ahorro == 'Otros'">
                <v-text-field dense v-model="perfil.otros_instituciones_ahorro"
                  :error-messages="errors.otros_instituciones_ahorro">
                </v-text-field>
                <b style="text-align: justify">Especifique otras instituciones en las cuales ahorra</b>
              </v-col>
              <v-col cols="12" sm="4" md="4">
                <v-checkbox dense v-model="perfil.negocio_propio"
                  label="¿Usted o algún miembro de su núcleo familiar tiene un negocio propio?">
                </v-checkbox>
              </v-col>
              <v-col cols="12" sm="4" md="4" v-if="this.perfil.id == null">
                <v-autocomplete dense v-model="perfil.uso_tiempo_libre" :items="uso_tiempo_libre_items" item-text="name"
                  item-value="id" chips deletable-chips multiple :error-messages="errors.uso_tiempo_libre" small-chips>
                </v-autocomplete>
                <b style="text-align: justify">Uso del tiempo libre (Selección múltiple). (si su respuesta es 'Otros' debe especificar cual)
                </b>
              </v-col>
              <v-col cols="12" sm="4" md="4" v-if="this.perfil.id > -1">
                <v-text-field dense v-model="perfil.uso_tiempo_libre" :items="uso_tiempo_libre_items" item-text="name"
                  item-value="id" chips deletable-chips multiple :error-messages="errors.uso_tiempo_libre">
                </v-text-field>
                <b style="text-align: justify">Uso del tiempo libre (Selección múltiple). (si su respuesta es 'Otros' debe especificar cual)
                </b>
              </v-col>
              <v-col cols="12" sm="4" md="4" v-if="perfil.uso_tiempo_libre == 'Otros'">
                <v-text-field dense v-model="perfil.otros_uso_tiempo_libre"
                  :error-messages="errors.otros_uso_tiempo_libre">
                </v-text-field>
                <b style="text-align: justify">Especifique otros usos del tiempo libre</b>
              </v-col>
              <v-col cols="12" sm="4" md="4" v-if="this.perfil.id == null">
                <v-autocomplete dense v-model="perfil.personas_comparte_tiempo" :items="personas_comparte_tiempo_items"
                  item-text="name" item-value="id" chips deletable-chips multiple small-chips
                  :error-messages="errors.personas_comparte_tiempo">
                </v-autocomplete>
                <b style="text-align: justify">¿Con quién pasas la mayor parte de tu tiempo de esparcimiento/ tiempo por fuera de tus
                  actividades laborales? (Puedes seleccionar máximo 2 opciones). (si su respuesta es 'Otros' debe
                  especificar cual)
                </b>
              </v-col>
              <v-col cols="12" sm="4" md="4" v-if="this.perfil.id > -1">
                <v-text-field dense v-model="perfil.personas_comparte_tiempo" :items="personas_comparte_tiempo_items"
                  item-text="name" item-value="id" chips deletable-chips multiple
                  :error-messages="errors.personas_comparte_tiempo">
                </v-text-field>
                <b style="text-align: justify">¿Con quién pasas la mayor parte de tu tiempo de esparcimiento/ tiempo por fuera de tus
                  actividades laborales? (Puedes seleccionar máximo 2 opciones). (si su respuesta es 'Otros' debe
                  especificar cual)
                </b>
              </v-col>
              <v-col cols="12" sm="4" md="4" v-if="perfil.personas_comparte_tiempo == 'Otros'">
                <v-text-field dense v-model="perfil.otros_personas_comparte_tiempo"
                  :error-messages="errors.otros_personas_comparte_tiempo">
                </v-text-field>
                <b style="text-align: justify">Especifique otras personas con las que comparte tiempo</b>
              </v-col>
              <v-col cols="12" sm="4" md="4" v-if="this.perfil.id == null">
                <v-autocomplete dense v-model="perfil.areas_estudios_interes" :items="areas_estudios_interes_items"
                  item-text="name" item-value="id" chips deletable-chips multiple small-chips
                  :error-messages="errors.areas_estudios_interes">
                </v-autocomplete>
                <b style="text-align: justify">¿Cuáles áreas de estudio son de su interés?. (Selección múltiple- máximo 5). (si su respuesta
                  es 'Otros' debe especificar cual)
                </b>
              </v-col>
              <v-col cols="12" sm="4" md="4" v-if="this.perfil.id > -1">
                <v-text-field dense v-model="perfil.areas_estudios_interes" :items="areas_estudios_interes_items"
                  item-text="name" item-value="id" chips deletable-chips multiple
                  :error-messages="errors.areas_estudios_interes">
                </v-text-field>
                <b style="text-align: justify">¿Cuáles áreas de estudio son de su interés?. (Selección múltiple- máximo 5). (si su respuesta
                  es 'Otros' debe especificar cual)
                </b>
              </v-col>
              <v-col cols="12" sm="4" md="4" v-if="perfil.areas_estudios_interes == 'Otros'">
                <v-text-field dense v-model="perfil.otros_barreras_uso_tiempo_libre"
                  label="Especifique otras áreas de estudio de su interés"
                  :error-messages="errors.otros_barreras_uso_tiempo_libre">
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="4" md="4" v-if="this.perfil.id == null">
                <v-autocomplete dense v-model="perfil.actividades_gustaria_hacer"
                  :items="actividades_gustaria_hacer_items" item-text="name" item-value="id" chips deletable-chips small-chips
                  multiple :error-messages="errors.actividades_gustaria_hacer">
                </v-autocomplete>
                <b style="text-align: justify">De las siguientes actividades indique ¿cuál le gustaría hacer? (puedes seleccionar máximo 2
                  opciones). (si su respuesta es 'Otros' debe especificar cual)
                </b>
              </v-col>
              <v-col cols="12" sm="4" md="4" v-if="this.perfil.id > -1">
                <v-text-field dense v-model="perfil.actividades_gustaria_hacer"
                  :items="actividades_gustaria_hacer_items" item-text="name" item-value="id" chips deletable-chips
                  multiple :error-messages="errors.actividades_gustaria_hacer">
                </v-text-field>
                <b style="text-align: justify">De las siguientes actividades indique ¿cuál le gustaría hacer? (puedes seleccionar máximo 2
                  opciones). (si su respuesta es 'Otros' debe especificar cual)
                </b>
              </v-col>
              <v-col cols="12" sm="4" md="4" v-if="perfil.actividades_gustaria_hacer == 'Otros'">
                <v-text-field dense v-model="perfil.otros_actividades_gustaria_hacer"
                  :error-messages="errors.otros_actividades_gustaria_hacer">
                </v-text-field>
                <b style="text-align: justify">Especifique otras actividades que le gustaría hacer</b>
              </v-col>
              <v-col cols="12" sm="4" md="4">
                <v-checkbox dense v-model="perfil.fuma" label="¿Fuma?">
                </v-checkbox>
              </v-col>
              <v-col cols="12" sm="4" md="4" v-if="perfil.fuma == true">
                <v-select dense v-model="perfil.fuma_periodicidad" :items="fuma_periodicidad_items"
                  :error-messages="errors.fuma_periodicidad">
                </v-select>
                <b style="text-align: justify">Especifique la periodicidad en la que fuma</b>
              </v-col>
              <v-col cols="12" sm="4" md="4">
                <v-checkbox dense v-model="perfil.bebidas_alcoholicas" label="¿Consume bebidas alcohólicas?">
                </v-checkbox>
              </v-col>
              <v-col cols="12" sm="4" md="4" v-if="perfil.bebidas_alcoholicas == true">
                <v-select dense v-model="perfil.bebidas_alcoholicas_periodicidad"
                  :items="bebidas_alcoholicas_periodicidad_items"
                  :error-messages="errors.bebidas_alcoholicas_periodicidad">
                </v-select>
                <b style="text-align: justify">Especifique la periodicidad en la que consume bebidas alcohólicas</b>
              </v-col>
              <v-col cols="12" sm="4" md="4">
                <v-checkbox dense v-model="perfil.sustancias_psicoactivas"
                  label="¿Usted consume sustancias psicoactivas?">
                </v-checkbox>
              </v-col>
              <v-col cols="12" sm="4" md="4" v-if="perfil.sustancias_psicoactivas == true">
                <v-select dense v-model="perfil.sustancias_psicoactivas_periodicidad"
                  :items="sustancias_psicoactivas_periodicidad_items"
                  :error-messages="errors.sustancias_psicoactivas_periodicidad">
                </v-select>
                <b style="text-align: justify">Especifique la periodicidad en la que consume sustenacias psicoactivas</b>
              </v-col>
              <v-col cols="12" sm="4" md="4">
                <v-checkbox dense v-model="perfil.alergico_medicamento" label="¿Usted es alérgico a algún medicamento?">
                </v-checkbox>
              </v-col>
              <v-col cols="12" sm="4" md="4" v-if="perfil.alergico_medicamento == true">
                <v-text-field v-model="perfil.alergico_medicamento_cuales"
                  :error-messages="errors.alergico_medicamento_cuales">
                </v-text-field>
                <b style="text-align: justify">Especifique cual o cuales medicamnetos es alergico</b>
              </v-col>
              <v-col cols="12" sm="4" md="4">
                <v-checkbox dense v-model="perfil.sufre_enfermedad" label="Sufre de alguna enfermedad">
                </v-checkbox>
              </v-col>
              <v-col cols="12" sm="4" md="4" v-if="perfil.sufre_enfermedad == true">
                <v-text-field dense v-model="perfil.sufre_enfermedad_cuales"
                  :error-messages="errors.sufre_enfermedad_cuales">
                </v-text-field>
                <b style="text-align: justify">Especifique cual o cuales enfermedades padece</b>
              </v-col>
              <v-col cols="12" sm="4" md="4">
                <v-checkbox dense v-model="perfil.vacunas_ultimo_anio" label="¿Ha recibido vacunas en el último año?">
                </v-checkbox>
              </v-col>
              <v-col cols="12" sm="4" md="4" v-if="perfil.vacunas_ultimo_anio == true">
                <v-text-field dense v-model="perfil.vacunas_ultimo_anio_cuales"
                  :error-messages="errors.vacunas_ultimo_anio_cuales">
                </v-text-field>
                <b style="text-align: justify">Especifique cual o cuales vacunas</b>
              </v-col>
              <v-col cols="12" sm="4" md="4">
                <v-checkbox dense v-model="perfil.refuerzo_vacunas_ultimo_anio"
                  label="¿Ha recibido refuerzos de vacunas de influenza, tétano u otras en el último año?">
                </v-checkbox>
              </v-col>
              <v-col cols="12" sm="4" md="4" v-if="perfil.refuerzo_vacunas_ultimo_anio == true">
                <v-text-field dense v-model="perfil.refuerzo_vacunas_ultimo_anio_cuales"
                  :error-messages="errors.refuerzo_vacunas_ultimo_anio_cuales">
                </v-text-field>
                <b style="text-align: justify">Especifique cual o cuales refuerzos de vacunas</b>
              </v-col>
              <v-col cols="12" sm="4" md="4">
                <v-checkbox dense v-model="perfil.salud_oral_ultimo_anio"
                  label="¿Ha recibido atención en salud oral en el último año?">
                </v-checkbox>
              </v-col>
              <v-col cols="12" sm="4" md="4" v-if="perfil.salud_oral_ultimo_anio == true">
                <v-text-field dense v-model="perfil.salud_oral_ultimo_anio_cuales"
                  :error-messages="errors.salud_oral_ultimo_anio_cuales">
                </v-text-field>
                <b style="text-align: justify">Especifique cual o cuales atenciones en salud oral</b>
              </v-col>
              <v-col cols="12" sm="4" md="4">
                <v-checkbox dense v-model="perfil.metodo_planificacion_familiar"
                  label="¿Utiliza algún método de Planificación familiar?">
                </v-checkbox>
              </v-col>
              <v-col cols="12" sm="4" md="4">
                <v-checkbox dense v-model="perfil.examen_agudeza_visual_ultimo_anio"
                  label="¿Se ha realizado examen de agudeza visual en el último año?">
                </v-checkbox>
              </v-col>
              <v-col cols="12" sm="4" md="4" v-if="this.perfil.id == null">
                <v-autocomplete dense v-model="perfil.barreras_uso_tiempo_libre"
                  :items="barreras_uso_tiempo_libre_items" item-text="name" item-value="id" chips deletable-chips small-chips
                  multiple :error-messages="errors.barreras_uso_tiempo_libre">
                </v-autocomplete>
                <b style="text-align: justify">¿Cuáles son las barreras que se le presentan generalmente en el uso del tiempo libre?</b>
              </v-col>
              <v-col cols="12" sm="4" md="4" v-if="this.perfil.id > -1">
                <v-text-field dense v-model="perfil.barreras_uso_tiempo_libre" :items="barreras_uso_tiempo_libre_items"
                  item-text="name" item-value="id" chips deletable-chips multiple
                  :error-messages="errors.barreras_uso_tiempo_libre">
                </v-text-field>
                <b style="text-align: justify">¿Cuáles son las barreras que se le presentan generalmente en el uso del tiempo libre?</b>
              </v-col>
              <v-col cols="12" sm="4" md="4" v-if="perfil.barreras_uso_tiempo_libre == 'Otros'">
                <v-text-field dense v-model="perfil.otros_barreras_uso_tiempo_libre"
                  :error-messages="errors.otros_barreras_uso_tiempo_libre">
                </v-text-field>
                <b style="text-align: justify">Especifique otras barreras para el uso del tiempo libre</b>
              </v-col>
              <v-col cols="12" sm="4" md="4" v-if="this.perfil.id == null">
                <v-autocomplete dense v-model="perfil.aspectos_gasta_dinero" :items="aspectos_gasta_dinero_items"
                  item-text="name" item-value="id" chips deletable-chips multiple small-chips
                  :error-messages="errors.aspectos_gasta_dinero">
                </v-autocomplete>
                <b style="text-align: justify">Seleccione los cinco principales aspectos en los que usted gasta sus ingresos</b>
              </v-col>
              <v-col cols="12" sm="4" md="4" v-if="this.perfil.id > -1">
                <v-text-field dense v-model="perfil.aspectos_gasta_dinero" :items="aspectos_gasta_dinero_items"
                  item-text="name" item-value="id" chips deletable-chips multiple
                  :error-messages="errors.aspectos_gasta_dinero">
                </v-text-field>
                <b style="text-align: justify">Seleccione los cinco principales aspectos en los que usted gasta sus ingresos</b>
              </v-col>
              <v-col cols="12" sm="4" md="4" v-if="perfil.aspectos_gasta_dinero == 'Otros'">
                <v-text-field dense v-model="perfil.otros_aspectos_gasta_dinero"
                  :error-messages="errors.otros_aspectos_gasta_dinero">
                </v-text-field>
                <b style="text-align: justify">Especifique otros aspectos gasta dinero</b>
              </v-col>
              <v-col cols="12" sm="12" md="12">
                <v-checkbox required dense v-model="perfil.autorizacion" :error-messages="errors.autorizacion"
                  label="Autorizo a la empresa a usar esta información, para fines administrativos y declaro la veracidad de la información suministrada.">
                </v-checkbox>
              </v-col>
            </v-row>
            <!-- <pre>{{perfil}}</pre> -->
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn small color="boton" dark @click="guardarPerfil()">
            Guardar
          </v-btn>
        </v-card-actions>
      </form>
  </div>
</template>

<script>
  import {
    listarPerfil,
  } from '@/api/perfilSociodemograficos/perfilSociodemografico'
  export default {
    middleware({
      $can,
      redirect
    }) {
      if (!$can('perfilSociodemografico.listar')) {
        return redirect('/');
      }
    },
    name: 'WorkspaceJsonPerfilSociodemograficoComponente',
    props: ['empleado_id'],
    data() {
      return {
        personas_depende: ['Ninguna', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
        turnos_trabajo: ['Diurno', 'Nocturno', 'Mixto'],
        miembros_hogar: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Más de 10'],
        hijos: ['No tengo hijos', '1', '2', '3', '4', '5', '6', '7'],
        hijos_rangos_edades: ['Entre 0 meses y 2 años', 'Entre 3 y 5 años', 'Entre 6 y 12 años',
          'Entre 13 y 17 años', 'Entre 18 y 28 años', 'Más de 29 años', 'Otros'
        ],
        tipos_vivienda: ['Familiar', 'Propia', 'Arrendada'],
        estratos_socioeconomico: ['1', '2', '3', '4', '5', '6'],
        servicios_publicos_items: ['Agua Potable y Servicio Alcantarillado, Energía, Gas',
          'Agua Potable y Servicio Alcantarillado, Energía', 'Agua Potable y Servicio Alcantarillado', 'Energía, Gas',
          'Energía', 'Gas'
        ],
        seguridad_orden_publico_items: ['Buena', 'Mala', 'Regular'],
        medio_transporte_items: ['Carro', 'Moto', 'Bicicleta', 'Patín eléctrico', 'Otros', 'Ninguno'],
        tiempo_transporte_items: ['Menos 30 minutos', 'Entre 30 minutos a 1 hora', 'Entre 1 a 2 horas',
          'Entre 2 a 3 horas', 'Entre 3 y 4 horas', 'Más de 4 horas'
        ],
        promedio_ingresos_mensuales_items: ['Hasta 1 SMLVM', 'Entre 1 y 2 SMLVM', 'Entre 2 y 4 SMLVM',
          'Entre 4 y 8 SMLVM', 'Entre 8 y 12 SMLVM', 'Más de 12 SMLVM'
        ],
        promedio_ingresos_mensuales_extralaborales_items: ['Hasta 1 SMLVM', 'Entre 1 y 2 SMLVM', 'Entre 2 y 4 SMLVM',
          'Entre 4 y 8 SMLVM', 'Entre 8 y 12 SMLVM', 'Entre 12 y 18 SMLVM', 'Más de 18 SMLVM',
          'No tiene ingresos extralaborales'
        ],
        personas_aportan_hogar_items: ['Ninguna, solo usted aporta', 'Usted no aporta', '1 persona más aporta',
          '2 personas más aportan', '3 personas más aportan', '4 o más personas aportan'
        ],
        aspectos_gasta_dinero_items: ['Vivienda o Arriendo', 'Pago cuotas crédito', 'Servicios públicos',
          'Alimentación', 'Transporte', 'Educación propia', 'Educación de sus hijos', 'Pago de crédito',
          'Recreación', 'Tiempo libre', 'Vestuario', 'Salud', 'Pago de celular', 'Pago de tarjetas de crédito',
          'Compra de tecnología', 'Cuidado personal y belleza', 'Otros'
        ],
        instituciones_ahorro_items: ['Inversiones', 'Bancos', 'Natilleras', 'Cooperativa de ahorro y crédito',
          'Fondos de empleados', 'Fondos de empleados', 'No ahorra', 'Otros'
        ],
        uso_tiempo_libre_items: ['Artes manuales (pintura, escultura, manualidades, entre otros',
          'Ir a cine', 'Visitar centros comerciales', 'Hobbies (Fotografía, cocina, entre otros)',
          'Tendencia redes sociales (ser youtuber, Blogger, etc.)',
          'Descansar o dormir', 'Actividades artísticas (Danza, teatro, música, entre otros)',
          'Visitar sitios de interés (Biblioteca, museos, etc.)', 'Viajar',
          'Ver televisión o plataformas interactivas (Netflix, Fox+, HBOGO, entre otros)',
          'Filantropía: (visitar fundaciones, sembrar árboles, participar de iniciativas comunales, entre otros)',
          'Jugar en línea o permanecer en internet', 'Salir a comer', 'Practicar deporte',
          'Leer', 'Ir de fiesta con sus amigos', 'Meditar, orar, entre otros',
          'Turismo', 'Frecuentar espectáculos artísticos y culturales (conciertos, teatro, entre otros)',
          'Realizar actividades al aire libre (visitar parques, caminatas ecológicas, picnic, entre otros)',
          'Voluntariados sociales, étnicos o culturales',
          'Ninguno', 'Otros'
        ],
        personas_comparte_tiempo_items: ['Hijos', 'Amigos', 'Mascotas', 'Solo', 'Familia', 'Amigos online',
          'Pareja (Novio o  cónyuge)', 'Compañero de trabajo', 'Otros'
        ],
        barreras_uso_tiempo_libre_items: ['Falta de dinero',
          'No coincidir la disponibilidad del tiempo libre con la familia',
          'Desconocimiento de actividades y programas', 'Falta motivación para salir', 'No disponer de tiempo libre',
          'Ninguno', 'Otros'
        ],
        areas_estudios_interes_items: ['Tecnología y/o sistemas', 'Desarrollo y liderazgo comunitario', 'Creatividad',
          'Agroindustriales y ganaderos', 'Humanidades', 'Artes',
          'Desarrollo y liderazgo étnicos y culturales', 'Matemática y afines', 'Cultura', 'Ciencias',
          'Físico deportivas', 'Turismo', 'Ecólogico y ambiental', 'Investigación', 'Salud', 'Educación',
          'Gastronomía', 'Otros'
        ],
        actividades_gustaria_hacer_items: ['Caminata ecológica', 'Torneo de bolos', 'Ir a un parque de diversiones',
          'Asistir a un retiro espiritual', 'Torneo deportivo', 'Participar en una carrera',
          'Participar en actividades de voluntariado', 'Asistir a un bazar', 'Torneo de Zumba', 'Torneo de ajedrez',
          'Visitar un parque acuático', 'Otros'
        ],
        fuma_periodicidad_items: ['Ocasionalmente', 'Semanalmente', '1 Vez al mes', '1 vez en el día',
          '2 o más veces en el día'
        ],
        bebidas_alcoholicas_periodicidad_items: ['Entre 1 y 4 veces al año', 'Entre 5 y 8 veces al año',
          'Entre 9 y 12 veces al año', 'Entre 2 y 4 veces al mes', 'Mas de 5 veces al mes'
        ],
        sustancias_psicoactivas_periodicidad_items: ['Rara vez', 'Una vez al mes', 'Semanalmente', 'Frecuente'],
        loading: false,
        perfiles: [],
        perfil: {
          turno_trabajo: '',
          numero_personas_depende: '',
          numero_miembros_hogar: '',
          numero_hijos: '',
          rango_edad_hijos: '',
          otros_rango_edad_hijos: '',
          tiene_mascota: false,
          cuantas_cuales_mascotas: '',
          tipo_vivienda: '',
          estrato_socioeconomico: '',
          servicios_publicos: '',
          seguridad_orden_publico: '',
          medio_transporte: '',
          otros_medio_transporte: '',
          tiempo_transporte: '',
          promedio_ingresos_mensuales: '',
          promedio_ingresos_mensuales_extralaborales: '',
          personas_aportan_hogar: '',
          aspectos_gasta_dinero: '',
          otros_aspectos_gasta_dinero: '',
          instituciones_ahorro: '',
          otros_instituciones_ahorro: '',
          negocio_propio: false,
          uso_tiempo_libre: '',
          otros_uso_tiempo_libre: '',
          personas_comparte_tiempo: '',
          otros_personas_comparte_tiempo: '',
          barreras_uso_tiempo_libre: '',
          areas_estudios_interes: '',
          otros_barreras_uso_tiempo_libre: '',
          actividades_gustaria_hacer: '',
          otros_actividades_gustaria_hacer: '',
          fuma: false,
          fuma_periodicidad: '',
          bebidas_alcoholicas: false,
          bebidas_alcoholicas_periodicidad: '',
          sustancias_psicoactivas: false,
          sustancias_psicoactivas_periodicidad: '',
          alergico_medicamento: false,
          alergico_medicamento_cuales: '',
          sufre_enfermedad: false,
          sufre_enfermedad_cuales: '',
          vacunas_ultimo_anio: false,
          vacunas_ultimo_anio_cuales: '',
          refuerzo_vacunas_ultimo_anio: false,
          refuerzo_vacunas_ultimo_anio_cuales: '',
          salud_oral_ultimo_anio: false,
          salud_oral_ultimo_anio_cuales: '',
          metodo_planificacion_familiar: false,
          examen_agudeza_visual_ultimo_anio: false,
          autorizacion: false,
        },
        editedIndex: -1,
        defecto: {
          turno_trabajo: '',
          numero_personas_depende: '',
          numero_miembros_hogar: '',
          numero_hijos: '',
          rango_edad_hijos: '',
          otros_rango_edad_hijos: '',
          tiene_mascota: false,
          cuantas_cuales_mascotas: '',
          tipo_vivienda: '',
          estrato_socioeconomico: '',
          servicios_publicos: '',
          seguridad_orden_publico: '',
          medio_transporte: '',
          otros_medio_transporte: '',
          tiempo_transporte: '',
          promedio_ingresos_mensuales: '',
          promedio_ingresos_mensuales_extralaborales: '',
          personas_aportan_hogar: '',
          aspectos_gasta_dinero: '',
          otros_aspectos_gasta_dinero: '',
          instituciones_ahorro: '',
          otros_instituciones_ahorro: '',
          negocio_propio: false,
          uso_tiempo_libre: '',
          otros_uso_tiempo_libre: '',
          personas_comparte_tiempo: '',
          otros_personas_comparte_tiempo: '',
          barreras_uso_tiempo_libre: '',
          areas_estudios_interes: '',
          otros_barreras_uso_tiempo_libre: '',
          actividades_gustaria_hacer: '',
          otros_actividades_gustaria_hacer: '',
          fuma: false,
          fuma_periodicidad: '',
          bebidas_alcoholicas: false,
          bebidas_alcoholicas_periodicidad: '',
          sustancias_psicoactivas: false,
          sustancias_psicoactivas_periodicidad: '',
          alergico_medicamento: false,
          alergico_medicamento_cuales: '',
          sufre_enfermedad: false,
          sufre_enfermedad_cuales: '',
          vacunas_ultimo_anio: false,
          vacunas_ultimo_anio_cuales: '',
          refuerzo_vacunas_ultimo_anio: false,
          refuerzo_vacunas_ultimo_anio_cuales: '',
          salud_oral_ultimo_anio: false,
          salud_oral_ultimo_anio_cuales: '',
          metodo_planificacion_familiar: false,
          examen_agudeza_visual_ultimo_anio: false,
          autorizacion: false,
        },
        errors: {
          turno_trabajo: '',
          numero_personas_depende: '',
          numero_miembros_hogar: '',
          numero_hijos: '',
          rango_edad_hijos: '',
          otros_rango_edad_hijos: '',
          cuantas_cuales_mascotas: '',
          tipo_vivienda: '',
          estrato_socioeconomico: '',
          servicios_publicos: '',
          seguridad_orden_publico: '',
          medio_transporte: '',
          otros_medio_transporte: '',
          tiempo_transporte: '',
          promedio_ingresos_mensuales: '',
          promedio_ingresos_mensuales_extralaborales: '',
          personas_aportan_hogar: '',
          aspectos_gasta_dinero: '',
          otros_aspectos_gasta_dinero: '',
          instituciones_ahorro: '',
          otros_instituciones_ahorro: '',
          uso_tiempo_libre: '',
          otros_uso_tiempo_libre: '',
          personas_comparte_tiempo: '',
          otros_personas_comparte_tiempo: '',
          barreras_uso_tiempo_libre: '',
          areas_estudios_interes: '',
          otros_barreras_uso_tiempo_libre: '',
          actividades_gustaria_hacer: '',
          otros_actividades_gustaria_hacer: '',
          fuma_periodicidad: '',
          bebidas_alcoholicas_periodicidad: '',
          sustancias_psicoactivas_periodicidad: '',
          alergico_medicamento_cuales: '',
          sufre_enfermedad_cuales: '',
          vacunas_ultimo_anio_cuales: '',
          refuerzo_vacunas_ultimo_anio: '',
          refuerzo_vacunas_ultimo_anio_cuales: '',
          salud_oral_ultimo_anio_cuales: '',
        },

      };
    },

    mounted() {
      this.listarPerfil();
    },

    watch: {
      empleado_id() {
        this.listarPerfil();
      }
    },

    methods: {
      async listarPerfil() {
        this.loading = true
        try {
          const {
            data
          } = await this.$loadingGetRequest(listarPerfil(this.empleado_id))
          this.perfil = data
          this.loading = false
        } catch (error) {
          this.loading = false
        }
      },

      guardarPerfil() {
        this.limpiarError()
        if (this.perfil.id > -1) {
          this.$axios.put('/perfil-sociodemografico/' + this.perfil.id, this.perfil).then(res => {
            this.$toast.success('Se actualizó el perfil sociodemográfico exitosamente')
            this.listarPerfil()
          }).catch(error => {
            if (error.response.data.mensaje) {
              this.$toast.error(error.response.data.mensaje)
            } else if (error.response.data) {
              this.ErrorEntrada(error.response.data)
            }
          })
        } else {
          this.perfil.empleado_id = this.empleado_id
          this.$axios.post('/perfil-sociodemografico/crear', this.perfil).then(res => {
            this.$toast.success('Se registró exitosamente el perfil sociodemográfico')
            this.listarLicencias()
            this.close()
          }).catch(error => {
            if (error.response.data.mensaje) {
              this.$toast.error(error.response.data.mensaje)
            } else if (error.response.data) {
              this.ErrorEntrada(error.response.data)
            }
          })
        }

      },

      ErrorEntrada(errors) {
        for (const key in this.errors) {
          if (key in errors) {
            this.errors[key] = errors[key].join(',')
          }
        }
      },

      limpiarError() {
        for (const key in this.errors) {
          this.errors[key] = ''
        }
      },

      editar(item) {
        this.editedIndex = this.perfiles.indexOf(item)
        this.perfil = Object.assign({}, item)
        this.dialog = true
      },

    },
  };

</script>
