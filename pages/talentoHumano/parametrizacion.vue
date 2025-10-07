<template>
  <v-card>
    <v-tabs centered next-icon="mdi-arrow-right" prev-icon="mdi-arrow-left" show-arrows>
      <v-tab>
        Áreas
      </v-tab>
      <v-tab>
        Cargos
      </v-tab>
      <v-tab>
        Entidades seguridad social
      </v-tab>
      <v-tab>
        Entidades exámen laboral
      </v-tab>
      <v-tab>
        Sedes
      </v-tab>
      <v-tab>
        Turnos
      </v-tab>
      <v-tab>
        Etiquetas
      </v-tab>
      <v-tab>
        Servicios
      </v-tab>
      <v-tab>
        Orientaciones sexuales
      </v-tab>
      <v-tab>
        Tipo de plantilla evaluación desempeño
      </v-tab>
      <v-tab>
        Pilares
      </v-tab>
      <v-tab>
        Competencias
      </v-tab>
      <v-tab>
        Proyectos
      </v-tab>
      <v-tab>
        Tipos de beneficios
      </v-tab>
      <v-tab>
        Plantillas inducción específica
      </v-tab>
      <v-tab>
        Temas inducción específica
      </v-tab>
      <v-tab>
        Plantillas evaluación periodo pruebas
      </v-tab>
      <v-tab>
        Criterios de evaluación periodo pruebas
      </v-tab>
      <v-tab>
        Bancos
      </v-tab>
      <v-tab>
        Tipos cuentas bancarias
      </v-tab>
      <v-tab>
        Proyectos contratos laborales
      </v-tab>
      <v-tab>
        Proyectos empleados
      </v-tab>
      <v-tab-item>
        <v-card flat>
          <v-card-text>
            <AreasThComponente />
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <v-card-text>
            <CargosComponente />
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <v-card-text>
            <PrestadorTh />
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <v-card-text>
            <EntidadExamen />
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <v-card-text>
            <sedePage />
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <v-card-text>
            <TurnosThComponente />
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <v-card-text>
            <EtiquetasThComponente />
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <v-card-text>
            <ServiciosThComponente />
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <v-card-text>
            <OrientacionesSexualesComponente />
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <v-card-text>
            <TipoPlantillaComponent />
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <v-card-text>
            <PilaresComponent />
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <v-card-text>
            <CompetenciasComponent />
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <v-card-text>
            <ProyectosComponente />
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <v-card-text>
            <BeneficiosComponente />
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <v-card-text>
            <PlantillaInduccionEspecificaComponente />
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <v-card-text>
            <tema-induccion-especifica-componente />
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <v-card-text>
            <PlantillasEvaluacionesPeriodosPruebasComponente />
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <v-card-text>
            <CriteriosEvaluacionesPeriodosPruebasComponente />
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <v-card-text>
            <bancoPage />
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <v-card-text>
            <tipoCuentaBancariaPage />
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <v-card-text>
            <ProyectosComponente />
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <v-card-text>
            <ProyectosEmpleadosComponente />
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs>
  </v-card>
</template>

<script>
  import AreasThComponente from '~/components/talentoHumano/areasTh/AreasThComponente.vue';
  import CargosComponente from '~/components/talentoHumano/cargos/CargosComponente.vue';
  import EtiquetasThComponente from '~/components/talentoHumano/etiquetas/EtiquetasThComponente.vue';
  import OrientacionesSexualesComponente from '~/components/talentoHumano/orientacionesSexuales/OrientacionesSexualesComponente.vue';
  import PrestadorTh from '~/components/talentoHumano/prestadores/PrestadorTh.vue';
  import ServiciosThComponente from '~/components/talentoHumano/servicios/ServiciosThComponente.vue';
  import TurnosThComponente from '~/components/talentoHumano/turnos/TurnosThComponente.vue';
  import EntidadExamen from './entidadExamen.vue';
  import TipoPlantillaComponent from "~/components/evaluacionDesempeno/TipoPlantillaComponent.vue";
  import PilaresComponent from "~/components/evaluacionDesempeno/PilaresComponent.vue";
  import CompetenciasComponent from "~/components/evaluacionDesempeno/CompetenciasComponent.vue";
  import ProyectosComponente from '~/components/talentoHumano/proyectos/ProyectosComponente.vue';
  import BeneficiosComponente from '~/components/talentoHumano/beneficios/BeneficiosComponente.vue';
  import PlantillaInduccionEspecificaComponente from '~/components/talentoHumano/InduccionesEspecificas/PlantillaInduccionEspecificaComponente.vue';
  import TemaInduccionEspecificaComponente from '~/components/talentoHumano/InduccionesEspecificas/TemaInduccionEspecificaComponente.vue';
  import PlantillasEvaluacionesPeriodosPruebasComponente from '~/components/talentoHumano/plantillasEvaluacionesPeriodosPruebas/PlantillasEvaluacionesPeriodosPruebasComponente.vue';
  import CriteriosEvaluacionesPeriodosPruebasComponente from '~/components/talentoHumano/criteriosEvaluacionPeriodoPruebas/CriteriosEvaluacionesPeriodosPruebasComponente.vue';
  import sedePage from '~/pages/admin/sedes.vue';
  import bancoPage from '~/pages/talentoHumano/bancos.vue'
  import tipoCuentaBancariaPage from '~/pages/talentoHumano/tipoCuentaBancarias.vue'
  import ProyectosEmpleadosComponente from '~/components/talentoHumano/proyectosEmpleados/proyectosEmpleadosComponente.vue';
  export default {
    middleware({
      $can,
      redirect
    }) {
      if (!$can('talentoHumano.parametrizacion')) {
        return redirect('/');
      }
    },
    name: 'WorkspaceJsonAreasTh',
    components: {
      AreasThComponente,
      CargosComponente,
      PrestadorTh,
      EntidadExamen,
      TipoPlantillaComponent,
      PilaresComponent,
      CompetenciasComponent,
      TurnosThComponente,
      EtiquetasThComponente,
      ServiciosThComponente,
      OrientacionesSexualesComponente,
      ProyectosComponente,
      BeneficiosComponente,
      PlantillaInduccionEspecificaComponente,
      TemaInduccionEspecificaComponente,
      PlantillasEvaluacionesPeriodosPruebasComponente,
      CriteriosEvaluacionesPeriodosPruebasComponente,
      sedePage,
      bancoPage,
      tipoCuentaBancariaPage,
      ProyectosEmpleadosComponente,
    },

    data() {
      return {

      };
    },
  };

</script>
