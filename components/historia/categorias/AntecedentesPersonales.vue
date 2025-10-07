<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="3">
        <v-autocomplete :items="patologias" label="Patologias" v-model="formAntecedentesPersonales.patologia"></v-autocomplete>
      </v-col>
      <v-col cols="12" sm="3" v-if="tipos.length > 0">
        <v-select v-model="formAntecedentesPersonales.tipo" :items="tipos" label="Tipo">
        </v-select>
      </v-col>
      <v-col cols="12" sm="3" v-if="formAntecedentesPersonales.patologia == 'Cancer' && formAntecedentesPersonales.tipo == 'Otro cancer'">
        <v-textarea name="input-7-1" v-model="formAntecedentesPersonales.otro"
                    label="Otro Cancer">
        </v-textarea>
      </v-col>
      <v-col cols="12" sm="3" v-if="formAntecedentesPersonales.patologia == 'Discapacidad'">
        <v-textarea name="input-7-1" v-model="formAntecedentesPersonales.otro"
                    label="Cual discapacidad">
        </v-textarea>
      </v-col>
      <v-col cols="12" sm="3" v-if="formAntecedentesPersonales.patologia == 'Otras Enfermedades Autoinmunes diferente a Artritis Reumatoidea' && formAntecedentesPersonales.tipo == 'Otras Enfermedades Autoinmunes'">
        <v-textarea name="input-7-1" v-model="formAntecedentesPersonales.otro"
                    label="Otra enfermedad autoinmune">
        </v-textarea>
      </v-col>
      <v-col cols="12" sm="3" v-if="formAntecedentesPersonales.patologia == 'Enfermedades Trasmision Sexual' && formAntecedentesPersonales.tipo == 'Otra enfermedad Sexual'">
        <v-textarea name="input-7-1" v-model="formAntecedentesPersonales.otro"
                    label="Otra enfermedad sexual">
        </v-textarea>
      </v-col>
      <v-col cols="12" sm="3" v-if="formAntecedentesPersonales.patologia == 'Otro patologia'">
        <v-textarea name="input-7-1" v-model="formAntecedentesPersonales.otro"
                    label="Otra patologia">
        </v-textarea>
      </v-col>
      <v-col cols="12" sm="3" v-if="formAntecedentesPersonales.patologia == 'Enfermedad Genética o Congenita Multiple'">
        <v-textarea name="input-7-1" v-model="formAntecedentesPersonales.otro"
                    label="Cual">
        </v-textarea>
      </v-col>
      <v-col cols="12" sm="3" v-if="formAntecedentesPersonales.patologia == 'Otras Enfermedades Neurologicas'">
        <v-textarea name="input-7-1" v-model="formAntecedentesPersonales.otro"
                    label="Descripcion">
        </v-textarea>
      </v-col>
      <v-col cols="12" sm="3" v-if="formAntecedentesPersonales.patologia == 'Enfermedad o Accidente Laboral'">
        <v-textarea name="input-7-1" v-model="formAntecedentesPersonales.otro"
                    label="Descripcion">
        </v-textarea>
      </v-col>

      <v-col ols="12" sm="3" v-if="formAntecedentesPersonales.patologia != 'Bronquitis Cronica' && formAntecedentesPersonales.patologia != 'Otras Enfermedades Neurologicas' &&
      formAntecedentesPersonales.patologia != 'Enfermedad o Accidente Laboral' && formAntecedentesPersonales.patologia != 'Enfermedad Musculo - Esqueleticas' &&
      formAntecedentesPersonales.patologia != 'Dermatitis Atopica' && formAntecedentesPersonales.patologia != 'Trastorno Mental' &&
      formAntecedentesPersonales.patologia != 'Discapacidad' && formAntecedentesPersonales.patologia">
        <v-text-field type="date" v-model="formAntecedentesPersonales.fecha_diagnostico"
                      label="Fecha de Diagnostico">
        </v-text-field>
      </v-col>

    </v-row>
  </v-container>
</template>
<script>
export default {
  name: 'CategoriaAntecedentesPersonales',
  data() {
    return {
      antecedentesPatologicos: [
        'COVID',
        'Cardiopatia Isquemica',
        'Hipertension Arterial',
        'Enfermedad Cardiovascular',
        'Enfermedad Cerebrovascular',
        'Enfermedad Renal Cronica',
        'Diabetes',
        'Obesidad',
        'Asma',
        'Epoc',
        'Anemia',
        'Gastritis',
        'Enfermedad Tiroidea',
        'Dislipidemia',
        'Artritis reumatoide',
        'Enfermedades transmisión sexual',
        'Cancer',
        'VIH',
        'Tuberculosis',
        'Malnutricion',
        'Discapacidad',
        'Sindrome de Apnea Hipoapnea del sueño',
        'Enfermedad Tromboembolica',
        'Enfermedad Arterial Oclusiva Cronica',
        'Enfermedades Trasmision Sexual',
        'Otras Enfermedades Neurologicas',
        'Convulsiones/Epilepsia',
        'Bronquitis Cronica',
        'Enfermedades Musculoesqueleticas',
        'Enfermedad o Accidente Laboral',
        'Enfermedad Genetica',
        'Otras Enfermedades Autoinmunes diferente a Artritis Reumatoidea',
        'Dermatitis Atopica',
        'Anomalia congenita mayor o multiple',
        'Patologia Perinatal o Neonatal significativa',
        'Presenta algun evento de interes en Salud Publica',
        'Niños con sospecha de problemas del desarrollo infantil',
        'Familiar manifiesta alguna preocupacion referente a la salud, puericultura o cuidado extra-escolar',
        'Problemas visuales',
        'Alteraciones sensoriales',
        'Trastorno Mental',
        'Conducta Suicida',
        'Victima de Maltrato Fisico y/o Psicologico',
        'Victima Abuso/Violencia Sexual',
        'Victima de Conflicto Armado',
        'Hijo de madre con sospecha o diagnostico de depresion postparto',
        'Hijo de padres con consumo de sustancias psicoactivas',
        'Hijo de padres con enfermedad mental',
        'Niño acompañante de mujer en privacion de la libertad en centro carcelario',
      ],
      cicloVida: '1ra Infancia',
      formAntecedentesPersonales:{
        patologia: null,
        tipo: null,
        otro:null,
        fecha_diagnostico:null
      },
    }
  },
  computed:{
    tipos(){
      let tipos = [];
      if(this.formAntecedentesPersonales.patologia){
        switch (this.formAntecedentesPersonales.patologia){
          case 'Cancer':
            tipos = [
              'Ca de Mama',
              'Ca de Prostata',
              'Ca Gastrico',
              'Ca de Colon',
              'Ca Hematopoyetico',
              'Ca de Cervix',
              'Ca de Cabeza y  Cuello',
              'Ca de Pancreas',
              'Ca de Hepatico',
              'Ca Renal',
              'Ca Oseo',
              'Piel',
              'Pene',
              'Otro cancer']
            break;
          case 'Asma':
            tipos = [
              'Bien controlado',
              'Parcialmente controlado',
              'No controlado']
            break;
          case 'Epoc':
            tipos = [
              'Leve',
              'Moderado',
              'Grave',
              'Muy grave']
            break;
          case 'Epoc':
          case 'Bronquitis Cronica':
            tipos = [
              'Leve',
              'Moderado',
              'Grave',
              'Muy grave']
            break;
          case 'Tuberculosis':
            tipos = [
              'Pulmonar',
              'Osea',
              'Meniengea',
              'Extrapulmonar']
            break;
          case 'Diabetes':
            tipos = [
              'Tipo I',
              'Tipo II',
              'Gestacional']
            break;
          case 'Enfermedad Renal Cronica':
            tipos = [
              'Estadio 1',
              'Estadio 2',
              'Estadio 3A',
              'Estadio 3B',
              'Estadio 4',
              'Estadio 5']
            break;
          case 'Trastorno Mental':
            tipos = [
              'Ansiedad',
              'Depresion',
              'Esquezofrenia',
              'Trastorno Afectivo Bipolar',
              'Deficit de Atencion por Hiperactividad',
              'Trastorno de la conducta alimentaria',
              'Trastorno de la Adaptacion',
              'Conducta Suicida']
            break;
          case 'Malnutricion':
            tipos = [
              'Obesidad',
              'Desnutricion']
            break;
          case 'Enfermedad Tiroidea':
            tipos = [
              'Hipertiroidismo',
              'Hipotiroidismo',
              'Hipotiroidismo Congenito']
            break;
          case 'Enfermedades Trasmision Sexual':
            tipos = [
              'Sifilis',
              'Blenorragia',
              'Condilomas',
              'VIH',
              'Hepatitis B',
              'Hepatitis C',
              'Otra enfermedad Sexual']
            break;
          case 'Otras Enfermedades Autoinmunes diferente a Artritis Reumatoidea':
            tipos = [
              'Lupus Eritematosos Sistemico (LES)',
              'Esclerosis',
              'Sjogren',
              'Espondilitis anquilosante',
              'Otras Enfermedades Autoinmunes']
            break;
        }
        return this.antecedentesPatologicos.filter(item => !tipos.includes(item));
      }
    },
    patologias(){
      let patologias = [];
        switch(this.cicloVida){
          case '1ra Infancia':
            patologias = ['Cardiopatia Isquémica', 'Epoc', 'Enfermedad Tromboembolica',
              'Enfermedad Arterial Oclusiva Cronica', 'Enfermedades Trasmision Sexual',
              'Enfermedad o Accidente Laboral'];
            break;
          case 'Infancia':
            patologias = ['Cardiopatia Isquémica', 'Epoc', 'Enfermedad Tromboembolica',
              'Enfermedad Arterial Oclusiva Cronica', 'Enfermedad o Accidente Laboral']
            break;
          case 'Adolescencia':
            patologias = [
              'Epoc',
              'Enfermedad Tromboembolica',
              'Enfermedad o Accidente Laboral',
              'Anomalia congénita mayor o multiple',
              'Patologia Perinatal o Neonatal significativa',
              'Niños con sospecha de problemas del desarrollo infantil',
              'Familiar manifiesta alguna preocupacion referente a la salud, puericultura o cuidado extra-escolar',
              'Alteraciones sensoriales',
              'Hijo de madre con sospecha o diagnostico de depresion postparto',
              'Hijo de padres con consumo de sustancias psicoactivas',
              'Hijo de padres con enfermedad mental',
              'Niño acompañante de mujer en privacion de la libertad en centro carcelario']
            break;
          case 'Juventud':
            patologias = [
              'Anomalia congénita mayor o multiple',
              'Patologia Perinatal o Neonatal significativa',
              'Niños con sospecha de problemas del desarrollo infantil',
              'Familiar manifiesta alguna preocupacion referente a la salud, puericultura o cuidado extra-escolar',
              'Alteraciones sensoriales',
              'Hijo de madre con sospecha o diagnostico de depresion postparto',
              'Hijo de padres con consumo de sustancias psicoactivas',
              'Hijo de padres con enfermedad mental',
              'Niño acompañante de mujer en privacion de la libertad en centro carcelario']
            break;
          case 'Adultez':
            patologias = [
              'Anomalia congénita mayor o multiple',
              'Patologia Perinatal o Neonatal significativa',
              'Niños con sospecha de problemas del desarrollo infantil',
              'Familiar manifiesta alguna preocupacion referente a la salud, puericultura o cuidado extra-escolar',
              'Alteraciones sensoriales',
              'Hijo de madre con sospecha o diagnostico de depresion postparto',
              'Hijo de padres con consumo de sustancias psicoactivas',
              'Hijo de padres con enfermedad mental',
              'Niño acompañante de mujer en privacion de la libertad en centro carcelario']
            break;
          case 'Vejez':
            patologias = [
              'Anomalia congénita mayor o multiple',
              'Patologia Perinatal o Neonatal significativa',
              'Niños con sospecha de problemas del desarrollo infantil',
              'Familiar manifiesta alguna preocupacion referente a la salud, puericultura o cuidado extra-escolar',
              'Alteraciones sensoriales',
              'Hijo de madre con sospecha o diagnostico de depresion postparto',
              'Hijo de padres con consumo de sustancias psicoactivas',
              'Hijo de padres con enfermedad mental',
              'Niño acompañante de mujer en privacion de la libertad en centro carcelario']
            break;
        }
        return patologias;
    }
  }
}
</script>
