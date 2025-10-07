<template>
  <div>
    <v-form ref="formRegistrarAfiliado">
      <v-row class="mt-4">
        <v-col cols="12" md="12" sm="12">
          <v-alert color="blue-grey" border="left" type="info" dense text icon="mdi-account-eye" class="text-center">
            <b>DATOS DE CARATERIZACIÓN BÁSICA</b>
          </v-alert>
        </v-col>
        <v-col cols="12" md="5" sm="12">
          <v-autocomplete dense outlined label="Tipo de documento" :items="opcionesTiposDocumento"
            :loading="loading.tiposDocumentos" no-data-text="No hay resultados" item-value="id" item-text="nombre"
            v-model="formRegistro.tipo_documento" :rules="[rules.obligatorio]" @focus="listarTiposDocumentos()"/>
        </v-col>
        <v-col cols="12" md="5" sm="12">
          <v-text-field dense outlined label="Número documento" v-model="formRegistro.numero_documento"
            hint="Ingresa el número de documento del afiliado" :rules="[rules.obligatorio]" />
        </v-col>
        <v-col cols="12" md="2" sm="12">
          <v-btn color="primary" block @click="verificarExistenciaAfiliado()">Verificar Existencia</v-btn>
        </v-col>
        <v-col cols="12" md="3" sm="6">
          <v-text-field label="Primer nombre *" v-model="formRegistro.primer_nombre" dense outlined
            :rules="[rules.obligatorio]"></v-text-field>
        </v-col>
        <v-col cols="12" md="3" sm="6">
          <v-text-field label="Segundo nombre" v-model="formRegistro.segundo_nombre" dense outlined></v-text-field>
        </v-col>
        <v-col cols="12" md="3" sm="6">
          <v-text-field label="Primer apellido *" v-model="formRegistro.primer_apellido" dense outlined
            :rules="[rules.obligatorio]"></v-text-field>
        </v-col>
        <v-col cols="12" md="3" sm="6">
          <v-text-field label="Segundo apellido" v-model="formRegistro.segundo_apellido" dense outlined></v-text-field>
        </v-col>
        <v-col cols="12" md="3" sm="6">
          <v-autocomplete :items="opcionesEntidad" label="Entidad *" item-text="nombre" item-value="id"
            v-model="formRegistro.entidad_id" dense outlined :rules="[rules.obligatorio]" @focus="listarEntidades()"></v-autocomplete>
        </v-col>
        <v-col cols="12" md="3" sm="6">
          <v-autocomplete :items="opcionesSexo" label="Sexo *" item-text="nombre" item-value="id"
            v-model="formRegistro.sexo" dense outlined :rules="[rules.obligatorio]"></v-autocomplete>
        </v-col>
        <v-col cols="12" md="3" sm="6">
          <v-menu dense v-model="menuFechaNacimiento" :close-on-content-click="false" :nudge-right="40"
            transition="scale-transition" offset-y min-width="auto">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field v-model="formRegistro.fecha_nacimiento" label="Fecha de nacimiento *"
                append-icon="mdi-calendar" readonly dense outlined v-bind="attrs" v-on="on" @change="actualizarEdad"
                :rules="[rules.obligatorio]"></v-text-field>
            </template>
            <v-date-picker v-model="formRegistro.fecha_nacimiento" @input="
              menuFechaNacimiento = false;
            actualizarEdad();
            "></v-date-picker>
          </v-menu>
        </v-col>
        <v-col cols="12" md="3" sm="6">
          <v-menu dense v-model="menuFechaAfiliacion" :close-on-content-click="false" :nudge-right="40"
            transition="scale-transition" offset-y min-width="auto">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field v-model="formRegistro.fecha_afiliacion" label="Fecha de afiliación *"
                append-icon="mdi-calendar" readonly dense outlined v-bind="attrs" v-on="on"
                :rules="[rules.obligatorio]"></v-text-field>
            </template>
            <v-date-picker v-model="formRegistro.fecha_afiliacion" @input="menuFechaAfiliacion = false"></v-date-picker>
          </v-menu>
        </v-col>
        <v-col cols="12" md="3" sm="6">
          <v-autocomplete :loading="loading.tipoAfiliacion" :items="opcionesTipoAfiliacion" label="Tipo de afiliación *"
            item-text="nombre" item-value="id" v-model="formRegistro.tipo_afiliacion_id" dense outlined
            :rules="[rules.obligatorio]" @focus="listarTiposAfiliacion()"></v-autocomplete>
        </v-col>
        <v-col cols="12" md="3" sm="6">
          <v-autocomplete :loading="loading.tipoAfiliado" :items="opcionesTipoAfiliado" label="Tipo de afiliado *"
            item-text="nombre" item-value="id" v-model="formRegistro.tipo_afiliado_id" dense outlined
            :rules="[rules.obligatorio]" @focus="listarTiposAfiliado()"></v-autocomplete>
        </v-col>
        <v-col cols="12" md="3" sm="6">
          <v-autocomplete :items="opcionesEstadoAfiliacion" label="Estado de afiliación *" item-text="nombre"
            item-value="id" v-model="formRegistro.estado_afiliacion_id" dense outlined :rules="[rules.obligatorio]">
          </v-autocomplete>
        </v-col>
        <v-col cols="12" md="3" sm="6">
          <v-autocomplete :items="opcionesGrupoSanguineo" label="Grupo sanguíneo"
            v-model="formRegistro.grupo_sanguineo" dense outlined></v-autocomplete>
        </v-col>
        <v-col cols="12" md="3" sm="6">
          <v-autocomplete :items="opcionesNivelAcademico" label="Nivel académico"
            v-model="formRegistro.nivel_educativo" dense outlined></v-autocomplete>
        </v-col>
        <v-col cols="12" md="3" sm="6">
          <v-text-field label="Ocupación" v-model="formRegistro.ocupacion" dense outlined></v-text-field>
        </v-col>
        <v-col cols="12" md="3" sm="6">
          <v-autocomplete label="Estado civil *" v-model="formRegistro.estado_civil" :items="opcionesEstadoCivil" dense
            outlined></v-autocomplete>
        </v-col>
        <v-col cols="12" md="3" sm="6">
          <v-autocomplete label="Orientación Sexual" v-model="formRegistro.orientacion_sexual"
            :items="opcionesOrientacionSexual" dense outlined></v-autocomplete>
        </v-col>
        <v-col cols="12" md="3" sm="6">
          <v-autocomplete label="Identidad de género" v-model="formRegistro.identidad_genero"
            :items="opcionesIdentidadGenero" dense outlined></v-autocomplete>
        </v-col>
        <v-col cols="12" md="3" sm="6">
          <v-autocomplete label="Discapacidad *" v-model="formRegistro.discapacidad" :items="opcionesDiscapacidad" dense
            outlined :rules="[rules.obligatorio]"></v-autocomplete>
        </v-col>
        <v-col cols="12" md="3" sm="6" v-if="
          formRegistro.discapacidad &&
          formRegistro.discapacidad !== 'Sin discapacidad'
        ">
          <v-autocomplete label="Grado Discapacidad *" v-model="formRegistro.grado_discapacidad"
            :items="opcionesGradoDiscapacidad" dense outlined :rules="[rules.obligatorio]"></v-autocomplete>
        </v-col>

        <!-- <v-col cols="12" md="3" sm="6">
          <v-autocomplete label="Rango de ingresos en SMLMV *" v-model="formRegistro.salario_minimo_afiliado"
            :items="opcionesRangoSalarial" dense outlined></v-autocomplete>
        </v-col> -->

        <v-col cols="12" md="3" sm="6">
          <v-autocomplete label="Plan *" :items="opcionesPlanes" v-model="formRegistro.plan" dense
            outlined></v-autocomplete>
        </v-col>

        <v-col cols="12" md="3" sm="6">
          <v-autocomplete label="Categoria *" :items="opcionesCategorias" v-model="formRegistro.categoria" dense
            outlined :disabled="!formRegistro.plan"></v-autocomplete>
        </v-col>

        <v-col cols="12" md="3" sm="6">
          <v-autocomplete label="Medico Familia 1" v-model="formRegistro.medico_familia1_id" :items="medicosYAuxiliares"
            :item-text="item => `${item.nombre} - ${item.apellido} - ${item.documento}`" item-value="id" dense
            outlined @focus="traerMedicos()"></v-autocomplete>
        </v-col>

        <v-col cols="12" md="3" sm="6">
          <v-autocomplete label="Medico Familia 2" v-model="formRegistro.medico_familia2_id" :items="medicosYAuxiliares"
            :item-text="item => `${item.nombre} - ${item.apellido} - ${item.documento}`" item-value="id" dense
            outlined @focus="traerMedicos()"></v-autocomplete>
        </v-col>


        <v-col cols="12" md="12" sm="12">
          <v-alert color="blue-grey" border="left" type="info" dense text icon="mdi-city" class="text-center">
            <b>UBICACIÓN DE ATENCIÓN</b>
          </v-alert>
        </v-col>
        <v-col cols="12" md="3" sm="6">
          <v-autocomplete :loading="loading.paises" :items="opcionesPaises" label="Nacionalidad *" item-text="nombre"
            item-value="id" v-model="formRegistro.pais_id" dense outlined :rules="[rules.obligatorio]" @focus="listarPaies()"></v-autocomplete>
        </v-col>
        <v-col cols="12" md="3" sm="6">
          <v-autocomplete :loading="loading.departamentos" :items="opcionesDepartamentos"
            label="Departamento de afiliación *" item-text="nombre" item-value="id"
            v-model="formRegistro.departamento_afiliacion_id" dense outlined @change="
              filtrarMunicipios(
                formRegistro.departamento_afiliacion_id,
                'afiliacion'
              )
              " :rules="[rules.obligatorio]" @focus="listarDepartamentos()"></v-autocomplete>
        </v-col>
        <v-col cols="12" md="3" sm="6">
          <v-autocomplete :loading="loading.municipios" :items="opcionesMunicipiosAfiliacion"
            label="Municipio de afiliación *" item-text="nombre" item-value="id"
            v-model="formRegistro.municipio_afiliacion_id" dense outlined :rules="[rules.obligatorio]"
            no-data-text="Debe Seleccionar el Departamento de Afiliación"></v-autocomplete>
        </v-col>
        <v-col cols="12" md="3" sm="6">
          <v-autocomplete :loading="loading.departamentos" :items="opcionesDepartamentos"
            label="Departamento de atención *" item-text="nombre" item-value="id"
            v-model="formRegistro.departamento_atencion_id" dense :rules="[rules.obligatorio]" outlined @change="
              filtrarMunicipios(
                formRegistro.departamento_atencion_id,
                'atencion'
              )
              " @focus="listarDepartamentos()"></v-autocomplete>
        </v-col>
        <v-col cols="12" md="3" sm="6">
          <v-autocomplete :loading="loading.municipios" :items="opcionesMunicipiosAtencion"
            label="Municipio de atención *" :rules="[rules.obligatorio]" item-text="nombre" item-value="id"
            v-model="formRegistro.municipio_atencion_id" dense outlined
            @change="listarReps(formRegistro.municipio_atencion_id)"
            no-data-text="Debe Seleccionar el Municipio de Atención"></v-autocomplete>
        </v-col>
        <v-col cols="12" sm="6" md="3" v-if="formRegistro.municipio_atencion_id === 149">
          <v-autocomplete dense :items="localidades" v-model="formRegistro.localidad"
            outlined label="Localidad"></v-autocomplete>
        </v-col>
        <v-col cols="12" md="3" sm="6">
          <v-autocomplete :items="opcionesRegion" label="Región *" v-model="formRegistro.region"
            :rules="[rules.obligatorio]" dense outlined></v-autocomplete>
        </v-col>
        <v-col cols="12" md="12" sm="12">
          <v-autocomplete :items="opcionesIPS" label="IPS Primaria *" v-model="formRegistro.ips_id" dense outlined
            item-text="nombre" item-value="id" :rules="[rules.obligatorio]"></v-autocomplete>
        </v-col>
        <v-col cols="12" md="12" sm="12">
          <v-alert color="blue-grey" border="left" type="info" dense text icon="mdi-cellphone-information"
            class="text-center">
            <b>DATOS DE CONTACTO Y LOCALIZACIÓN</b>
          </v-alert>
        </v-col>
        <v-col cols="12" md="3" sm="6">
          <v-text-field dense outlined label="Teléfono" v-model="formRegistro.telefono"></v-text-field>
        </v-col>
        <v-col cols="12" md="3" sm="6">
          <v-text-field dense outlined label="Celular principal *" v-model="formRegistro.celular1"
            :rules="[rules.obligatorio]"></v-text-field>
        </v-col>
        <v-col cols="12" md="3" sm="6">
          <v-text-field dense outlined label="Celular secundario" v-model="formRegistro.celular2"></v-text-field>
        </v-col>
        <v-col cols="12" md="3" sm="6">
          <v-text-field dense type="email" outlined label="Correo electrónico principal *"
            v-model="formRegistro.correo1" :rules="[rules.obligatorio, rules.correo]"></v-text-field>
        </v-col>
        <v-col cols="12" md="3" sm="6">
          <v-text-field dense type="email" outlined label="Correo electrónico secundario"
            v-model="formRegistro.correo2"></v-text-field>
        </v-col>
        <v-col cols="12" md="3" sm="6">
          <v-autocomplete dense :items="opcionesDireccionResidencia" outlined
            label="(Calle, Avenida, Carrera, etc...) *" v-model="formRegistro.direccion_residencia_cargue"
            :rules="[rules.obligatorio]"></v-autocomplete>
        </v-col>
        <v-col cols="12" md="3" sm="6">
          <v-text-field dense outlined v-model="formRegistro.direccion_residencia_via" label="Numero exterior *"
            hint="Nota: Número, letras despues de la calle y antes del #"></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-text-field dense outlined v-model="formRegistro.direccion_residencia_numero_interior"
            label="Primer número interior *" hint="Nota: primer número despues del #">
          </v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-text-field dense v-model="formRegistro.direccion_residencia_interior" outlined
            label="Segundo número interior *" hint="Nota: Segundo número despues del #">
          </v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-text-field dense v-model="formRegistro.direccion_residencia_numero_exterior" outlined label="Interior *"
            hint="Ejemplo: Apte 430, Urb. Peña, Casa 124">
          </v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-text-field dense v-model="formRegistro.direccion_residencia_barrio" outlined label="Barrio">
          </v-text-field>
        </v-col>
        <v-col cols="12" md="3" sm="6">
          <v-autocomplete :loading="loading.departamentos" :items="opcionesDepartamentos"
            label="Departamento de residencia *" item-text="nombre" item-value="id"
            v-model="formRegistro.dpto_residencia_id" dense outlined @change="
              filtrarMunicipios(formRegistro.dpto_residencia_id, 'residencia');
            listarColegios(formRegistro.dpto_residencia_id);
            " :rules="[rules.obligatorio]"></v-autocomplete>
        </v-col>
        <v-col cols="12" md="3" sm="6">
          <v-autocomplete :loading="loading.municipios" :items="opcionesMunicipiosResidencia"
            label="Municipio de residencia *" item-text="nombre" item-value="id"
            v-model="formRegistro.mpio_residencia_id" dense outlined :rules="[rules.obligatorio]"
            no-data-text="Debe seleccionar un Departamento de Residencia"></v-autocomplete>
        </v-col>
        <v-col cols="12" md="12" sm="12" v-if="
          formRegistro.tipo_afiliado_id && formRegistro.tipo_afiliado_id !== 1
        ">
          <v-autocomplete :loading="loading.colegios" :items="opcionesColegios" label="Colegio" item-text="nombre"
            item-value="id" v-model="formRegistro.colegio_id" dense outlined></v-autocomplete>
        </v-col>

        <!-- Datos del beneficiario -->
        <v-col cols="12" sm="6" md="12" v-if="formRegistro.tipo_afiliado_id == 1">
          <v-alert border="left" dense text color="blue-grey" icon="mdi-human-male-board">
            <strong>Datos del Cotizante</strong>
          </v-alert>
        </v-col>
        <v-col cols="12" sm="6" md="3" v-if="formRegistro.tipo_afiliado_id == 1">
          <v-autocomplete outlined dense v-model="formRegistro.parentesco" label="Parentesco" :items="parentesco">
          </v-autocomplete>
        </v-col>
        <v-col cols="12" sm="6" md="3" v-if="formRegistro.tipo_afiliado_id == 1">
          <v-autocomplete :rules="[rules.obligatorioBeneficiario]" dense outlined :items="opcionesTiposDocumento"
            v-model="formRegistro.tipo_documento_cotizante" item-text="nombre" item-value="nombre"
            label="Tipo de documento cotizante">
          </v-autocomplete>
        </v-col>
        <v-col cols="12" sm="6" md="3" v-if="formRegistro.tipo_afiliado_id == 1">
          <v-text-field :rules="[rules.obligatorioBeneficiario]" outlined dense
            v-model="formRegistro.numero_documento_cotizante" label="Documento cotizante"
            hint="No usar puntos o caracteres especiales">
          </v-text-field>
        </v-col>
        <v-col cols="12" md="12" sm="12" align="end">
          <v-btn dark color="warning" @click="limpiarFormulario()">Limpiar Formulario</v-btn>
          <v-btn dark color="success" @click="enviarFormularioRegistro()">Guardar</v-btn>
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>
<script>
import {
  mapActions
} from "vuex";

export default {
  data() {
    return {
      medicosYAuxiliares: [],
      formRegistro: {
        tipo_documento: null,
        numero_documento: "",
        primer_nombre: "",
        segundo_nombre: "",
        primer_apellido: "",
        segundo_apellido: "",
        entidad_id: null,
        fecha_nacimiento: "",
        fecha_afiliacion: "",
        tipo_afiliacion_id: null,
        tipo_afiliado_id: null,
        estado_afiliacion_id: null,
        grupo_sanguineo: "",
        nivel_educativo: "",
        ocupacion: "",
        estado_civil: "",
        orientacion_sexual: "",
        identidad_genero: "",
        discapacidad: "",
        grado_discapacidad: "",
        salario_minimo_afiliado: "",
        plan: "",
        categoria: "",
        pais_id: null,
        departamento_afiliacion_id: null,
        municipio_afiliacion_id: null,
        departamento_atencion_id: null,
        municipio_atencion_id: null,
        dpto_residencia_id: null,
        mpio_residencia_id: null,
        region: "",
        ips_id: null,
        medico_familia1_id: null,
        medico_familia2_id: null,
        telefono: "",
        celular1: "",
        celular2: "",
        correo1: "",
        correo2: "",
        direccion_residencia_cargue: "",
        direccion_residencia_via: "",
        direccion_residencia_numero_interior: "",
        direccion_residencia_interior: "",
        direccion_residencia_numero_exterior: "",
        direccion_residencia_barrio: "",
        colegio_id: null,
        numero_documento_cotizante: null,
        tipo_documento_cotizante: null,
        parentesco: null,
      },
      rules: {
        obligatorio: (value) => !!value || "Este campo es obligatorio.",
        correo: (v) => this.emailRegex.test(v) || "Debe ser un correo válido",
        obligatorioBeneficiario: (value) => {
          if (this.formRegistro.tipo_afiliado_id === 1) {
            return !!value || "Este campo es obligatorio para el tipo de afiliado es beneficiario.";
          }
          return true;
        }
      },

      emailRegex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      loading: {
        tiposDocumentos: false,
        entidades: false,
        tipoAfiliacion: false,
        tipoAfiliado: false,
        paises: false,
        departamentos: false,
        reps: false,
        colegios: false,
      },
      opcionesTiposDocumento: [],
      opcionesEntidad: [],
      opcionesSexo: [{
        id: "M",
        nombre: "Masculino",
      },
      {
        id: "F",
        nombre: "Femenino",
      },
      ],
      opcionesTipoAfiliacion: [],
      opcionesTipoAfiliado: [],
      opcionesEstadoAfiliacion: [{
        id: 1,
        nombre: "Activo",
      },
      {
        id: 31,
        nombre: "Retirado",
      },
      {
        id: 32,
        nombre: "Protección Laboral Cotizante",
      },
      {
        id: 33,
        nombre: "Protección Laboral Beneficiario",
      },
      ],
      opcionesGrupoSanguineo: [
        "A -",
        "A +",
        "AB -",
        "AB +",
        "B -",
        "B +",
        "O -",
        "O +",
      ],
      opcionesNivelAcademico: [
        "Analfabeta",
        "Inicial",
        "Preescolar",
        "Primaria",
        "Bachiller",
        "Tecnólogo/Técnico",
        "Universitario",
        "Postgrado (Especialización,maestría,doctorado)",
      ],
      opcionesEstadoCivil: [
        "Soltero",
        "Casado",
        "Unión libre",
        "Viudo",
        "Separado",
        "Divorciado",
      ],
      opcionesOrientacionSexual: [
        "Heterosexual",
        "Homosexual",
        "Bisexual",
        "Pansexual",
        "Asexual",
        "No desea contestar",
      ],
      opcionesIdentidadGenero: [
        "Hombre",
        "Mujer",
        "Transgenero",
        "Genero Neutro",
        "Agenero",
        "No desea contestar",
      ],
      opcionesDiscapacidad: [
        "Sin discapacidad",
        "Física",
        "Auditiva",
        "Mental/psíquica",
        "Sordo - Ceguera",
        "Visual",
      ],
      opcionesGradoDiscapacidad: ["Leve", "Moderada", "Severa"],
      opcionesRangoSalarial: [
        "MENOR A 2 SMLMV",
        "ENTRE 2 Y 5 SMLMV",
        "MAYOR A 5 SMLMV",
      ],
      opcionesPaises: [],
      opcionesDepartamentos: [],
      opcionesMunicipiosAfiliacion: [],
      opcionesMunicipiosAtencion: [],
      opcionesMunicipiosResidencia: [],
      opcionesRegion: [
        "Región 1",
        "Región 2",
        "Región 3",
        "Región 4",
        "Región 5",
        "Región 6",
        "Región 7",
        "Región 8",
        "Región 9",
        "Región 10",
      ],
      opcionesIPS: [],
      opcionesDireccionResidencia: [
        "Calle",
        "Avenida",
        "Carrera",
        "Transversal",
        "Autopista",
        "Vereda",
      ],
      parentesco: [
        "PADRE O MADRE",
        "CONYUGUE O COMPAÑERO",
        "HIJO DOCENTE",
        "HIJO DISCAPACITADO",
        "HIJO CONYUGE",
        "HIJO ADOPTIVO",
        "NIETO MENOR O IGUAL A 30 DÍAS",
        "PRIMO(A)",
        "TÍO(A)",
        "ABUELO(A)",
        "NO APLICA",
      ],
      opcionesColegios: [],
      edadMinimaPorDocumento: {
        1: 18, // Cédula de ciudadanía, mínimo 18 años
        2: 7, // Tarjeta de identidad, mínimo 7 años
        3: 0, // Registro civil, sin mínimo
        4: 7, // Tarjeta de extranjería, mínimo 7 años
        5: 18, // Cédula de extranjería, mínimo 18 años
        6: 0, // NIT, sin mínimo
        7: 0, // Pasaporte, sin mínimo
        8: 0, // Tipo documento extranjero, sin mínimo
        9: 0, // Permiso especial de permanencia, sin mínimo
        10: 0, // Permiso de protección temporal, sin mínimo
        11: 0, // SalvoConducto, sin mínimo
        12: 0, // Certificado de Nacido Vivo, sin mínimo
        13: 18, // Adulto sin Identificación, mínimo 18 años
        14: 0, // Menor sin Identificar, sin mínimo
      },
      edadMaximaPorDocumento: {
        1: null, // Cédula de ciudadanía, sin máximo
        2: 17, // Tarjeta de identidad, máximo 17 años
        3: 6, // Registro civil, máximo 6 años
        4: null, // Tarjeta de extranjería, sin máximo
        5: null, // Cédula de extranjería, sin máximo
        6: null, // NIT, sin máximo
        7: null, // Pasaporte, sin máximo
        8: null, // Tipo documento extranjero, sin máximo
        9: null, // Permiso especial de permanencia, sin máximo
        10: null, // Permiso de protección temporal, sin máximo
        11: null, // SalvoConducto, sin máximo
        12: 1, // Certificado de Nacido Vivo, máximo 1 año
        13: null, // Adulto sin Identificación, sin máximo
        14: 17, // Menor sin Identificar, máximo 17 años
      },
      opcionesPlanes: [
        "PAC",
        "POS",
      ],
      opcionesCategorias: [
        "A",
        "B",
        "C",
      ],
      menuFechaNacimiento: false,
      menuFechaAfiliacion: false,
      cargarTiposDocumentos: false,
      cargarEntidades: false,
      cargarTiposAfiliacion: false,
      cargarTiposAfiliado: false,
      cargarPaies: false,
      cargarDepartamentos: false,
      cargarMedicos: false,
    };
  },
//   mounted() {
//     this.listarTiposDocumentos();
//     this.listarEntidades();
//     this.listarTiposAfiliacion();
//     this.listarTiposAfiliado();
//     this.listarPaies();
//     this.listarDepartamentos();
//     this.traerMedicos();
//   },
  watch: {
    // Ejecutar la validación de la edad cuando se cambie el tipo de documento o la fecha de nacimiento
    "formRegistro.tipo_documento": function () {
      this.validarTipoDocumento();
    },
    "formRegistro.fecha_nacimiento": function () {
      this.actualizarEdad();
    },
  },
  methods: {
    ...mapActions("app", ["setPreload"]),

    async verificarExistenciaAfiliado() {
      if (
        !this.formRegistro.numero_documento ||
        !this.formRegistro.tipo_documento
      ) {
        this.$toast.error(
          "Debe digitar el tipo y número de documento para verificar la existencia del afiliado."
        );
        return false; // Retorna false si faltan datos
      }

      this.setPreload(true);

      try {
        const response = await this.$axios.get(
          `/afiliados/verificarExistencia/${this.formRegistro.numero_documento}/${this.formRegistro.tipo_documento}`
        );

        if (response.data.res) {
          // Si el afiliado ya existe, mostrar un $swal con el mensaje y bloquear el formulario

          this.$swal.fire({
            type: "warning",
            title: "Afiliado existente",
            text: "Ya existe un afiliado con este número y tipo de documento.",
            confirmButtonText: "Aceptar",
          });
          return false; // Retorna false si el afiliado ya existe
        } else {
          this.$toast.success(
            "No se encontró ningún afiliado con este documento. Puede proceder con el registro."
          );

          return true; // Retorna true si no existe
        }
      } catch (error) {
        this.$toast.error("Ocurrió un error en la verificación.");
        console.error(error);
        return false; // Retorna false si hay error
      } finally {
        this.setPreload(false);
      }
    },
    calcularEdad(fechaNacimiento) {
      const hoy = new Date();
      const fechaNac = new Date(fechaNacimiento);
      let edad = hoy.getFullYear() - fechaNac.getFullYear();
      const mes = hoy.getMonth() - fechaNac.getMonth();
      if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
        edad--;
      }
      return edad;
    },

    validarEdadAfiliado() {
      const edad = this.calcularEdad(this.formRegistro.fecha_nacimiento);
      const tipoDocumento = this.formRegistro.tipo_documento;
      const edadMinima = this.edadMinimaPorDocumento[tipoDocumento];
      const edadMaxima = this.edadMaximaPorDocumento[tipoDocumento];

      if (edad < edadMinima) {
        this.$swal.fire({
          type: "warning",
          title: "Edad no válida",
          text: `La edad del afiliado (${edad} años) es menor que la mínima requerida para el tipo de documento seleccionado (${edadMinima} años).`,
        });
        return false;
      }
      if (edadMaxima !== null && edad > edadMaxima) {
        this.$swal.fire({
          type: "warning",
          title: "Edad no válida",
          text: `La edad del afiliado (${edad} años) excede la máxima permitida para el tipo de documento seleccionado (${edadMaxima} años).`,
        });
        return false;
      }
      return true;
    },

    // Validación al cambiar el tipo de documento
    validarTipoDocumento() {
      if (this.formRegistro.fecha_nacimiento) {
        return this.validarEdadAfiliado();
      }
      return true;
    },

    // Validación al cambiar la fecha de nacimiento
    actualizarEdad() {
      if (this.formRegistro.tipo_documento) {
        return this.validarEdadAfiliado();
      }
      return true;
    },

    async enviarFormularioRegistro() {
      // Validar el formulario
      if (!this.$refs.formRegistrarAfiliado.validate()) {
        return;
      }

      // Validar la existencia del afiliado
      const existeAfiliado = await this.verificarExistenciaAfiliado();

      if (!existeAfiliado) {
        return; // Evitar continuar si el afiliado ya existe
      }

      // Validar la edad antes de enviar el formulario
      if (!this.validarEdadAfiliado()) {
        return;
      }

      // Si todo es válido, proceder con la creación del afiliado
      this.setPreload(true); // Mostrar el preloader
      try {
        const response = await this.$axios.post(
          "/afiliados/crearAfiliadoAseguramiento",
          this.formRegistro
        );

        console.log(this.formRegistro);

        this.$swal.fire({
          type: "success",
          title: "Afiliado creado",
          text: "El afiliado ha sido creado exitosamente.",
          confirmButtonText: "Aceptar",
        });

        // Limpiar el formulario después de la creación exitosa
        this.limpiarFormulario();
      } catch (error) {
        this.$swal.fire({
          type: "error",
          title: "Error al crear afiliado",
          text: error.response?.data?.mensaje || "Ocurrió un error inesperado.",
          confirmButtonText: "Aceptar",
        });
      } finally {
        this.setPreload(false); // Ocultar el preloader
      }
    },

    listarTiposDocumentos() {
      if(this.cargarTiposDocumentos) return;
      this.loading.tiposDocumentos = true;
      this.$axios
        .get("/tipo-documento/listar")
        .then((res) => {
          this.opcionesTiposDocumento = res.data;
          this.cargarTiposDocumentos = true;
        })
        .catch((error) => {
          this.$toast.error(
            "Ocurrió un error al cargar los tipos de documento"
          );
          console.log(error);
        })
        .finally(() => {
          this.loading.tiposDocumentos = false;
        });
    },

    listarEntidades() {
        if(this.cargarEntidades) return;
      this.loading.entidades = true;
      this.$axios
        .get("/entidad/listar")
        .then((res) => {
          this.opcionesEntidad = res.data;
          this.cargarEntidades = true;
        })
        .catch((error) => {
          this.$toast.error("Error al cargar las entidades");
        })
        .finally(() => {
          this.loading.entidades = false;
        });
    },

    listarTiposAfiliacion() {
      if(this.cargarTiposAfiliacion) return;
      this.loading.tipoAfiliacion = true;
      this.$axios
        .get("tipo-afiliacion")
        .then((res) => {
          this.opcionesTipoAfiliacion = res.data.data;
          this.cargarTiposAfiliacion = true;
        })
        .catch((error) => {
          this.$toast.error("Error al cargar los tipos de afiliaciones");
        })
        .finally(() => {
          this.loading.tipoAfiliacion = false;
        });
    },

    listarPaies() {
      if(this.cargarPaies) return;
      this.loading.paises = true;
      this.$axios
        .post("/pais/listar")
        .then((res) => {
          this.opcionesPaises = res.data
            .map((pais) => {
              return {
                id: pais.id,
                nombre: `${pais.nombre}`,
              };
            });
            this.cargarPaies = true;
        })
        .catch((error) => {
          this.$toast.error(error.response.data.mensaje);
        })
        .finally(() => {
          this.loading.paises = false;
        });
    },

    listarDepartamentos() {
      if(this.cargarDepartamentos) return;
      this.loading.departamentos = true;
      this.$axios
        .get("/departamento")
        .then((res) => {
          this.opcionesDepartamentos = res.data;
          this.cargarDepartamentos = true;
        })
        .catch((error) => {
          this.$toast.error("Error al cargar los departamentos");
        })
        .finally(() => {
          this.loading.departamentos = false;
        });
    },

    listarTiposAfiliado(){
      if(this.cargarTiposAfiliado) return;
      this.loading.tipoAfiliado = true;
      this.$axios
        .get("/tipo-afiliados/listar")
        .then((res) => {
          this.opcionesTipoAfiliado = res.data.data;
          this.cargarTiposAfiliado = true;
        })
        .catch((error) => {
          this.$toast.error("Error al cargar los tipos de afiliados");
        })
        .finally(() => {
          this.loading.tipoAfiliado = false;
        });
    },

    filtrarMunicipios(departamentoId, tipoMunicipio) {
      if (!departamentoId) return;

      const departamentoSeleccionado = this.opcionesDepartamentos.find(
        (departamento) => departamento.id === departamentoId
      );

      if (!departamentoSeleccionado) {
        switch (tipoMunicipio) {
          case "afiliacion":
            this.opcionesMunicipiosAfiliacion = [];
            break;
          case "atencion":
            this.opcionesMunicipiosAtencion = [];
            break;
          case "residencia":
            this.opcionesMunicipiosResidencia = [];
            break;
          default:
            console.error("Tipo de municipio no reconocido:", tipoMunicipio);
        }
        return;
      }

      switch (tipoMunicipio) {
        case "afiliacion":
          this.formRegistro.municipio_afiliacion_id = null;
          this.opcionesMunicipiosAfiliacion =
            departamentoSeleccionado.municipios;
          break;
        case "atencion":
          this.formRegistro.municipio_atencion_id = null;
          this.opcionesMunicipiosAtencion = departamentoSeleccionado.municipios;
          break;
        case "residencia":
          this.formRegistro.mpio_residencia_id = null;
          this.opcionesMunicipiosResidencia =
            departamentoSeleccionado.municipios;
          break;
        default:
          console.error("Tipo de municipio no reconocido:", tipoMunicipio);
      }
    },

    listarReps(municipioId) {
      //Reiniciar la IPS Primaria
      this.formRegistro.ips_id = null;

      this.loading.reps;
      this.$axios
        .get(`/municipios/reps/${municipioId}`)
        .then((res) => {
          this.opcionesIPS = res.data;
        })
        .catch((error) => {
          this.$toast.error("Error al cargar las IPS");
        })
        .finally(() => {
          this.loading.reps = false;
        });
    },

    listarColegios(departamentoId) {
      this.loading.colegios = true;
      this.$axios
        .get("/colegios/colegioDepartamento/" + departamentoId)
        .then((res) => {
          this.opcionesColegios = res.data.map((colegio) => {
            return {
              id: colegio.id,
              nombre: `${colegio.nombre} - ${colegio.municipio.nombre}`,
            };
          });
          if (!this.opcionesColegios.length) {
            this.$swal({
              title: "No hay colegios",
              text: "No hay colegios disponibles en el departamento seleccionado.",
              type: "info",
              confirmButtonText: "Aceptar",
            });
          }
        })
        .catch(() => {
          this.$swal({
            title: "Error",
            text: "No se pudo listar los colegios.",
            type: "error",
            confirmButtonText: "Aceptar",
          });
        })
        .finally(() => {
          this.loading.colegios = false;
        });
    },

    traerMedicos() {
      if(this.cargarMedicos) return;
      this.$axios
        .get(
          "/especialidades/listar-medicos-y-auxiliares/" + 1
        )
        .then((response) => {
          this.medicosYAuxiliares = response.data;
          this.cargarMedicos = true;
        })
        .catch((error) => {
          console.log(error);
        });
    },

    limpiarFormulario() {
      this.formRegistro = {
        tipo_documento: null,
        numero_documento: "",
        primer_nombre: "",
        segundo_nombre: "",
        primer_apellido: "",
        segundo_apellido: "",
        entidad_id: null,
        fecha_nacimiento: "",
        fecha_afiliacion: "",
        tipo_afiliacion_id: null,
        tipo_afiliado_id: null,
        estado_afiliacion_id: null,
        grupo_sanguineo: "",
        nivel_educativo: "",
        ocupacion: "",
        estado_civil: "",
        orientacion_sexual: "",
        identidad_genero: "",
        discapacidad: "",
        grado_discapacidad: "",
        salario_minimo_afiliado: "",
        pais_id: null,
        departamento_afiliacion_id: null,
        municipio_afiliacion_id: null,
        departamento_atencion_id: null,
        municipio_atencion_id: null,
        dpto_residencia_id: null,
        mpio_residencia_id: null,
        region: "",
        ips_id: null,
        medico_familia1_id: "",
        medico_familia2_id: "",
        telefono: "",
        celular1: "",
        celular2: "",
        correo1: "",
        correo2: "",
        direccion_residencia_cargue: "",
        direccion_residencia_via: "",
        direccion_residencia_numero_interior: "",
        direccion_residencia_interior: "",
        direccion_residencia_numero_exterior: "",
        direccion_residencia_barrio: "",
        colegio_id: null,
        parentesco: null,
        tipo_documento_cotizante: null,
        numero_documento_cotizante: null,
      };

      this.$refs.formRegistrarAfiliado.resetValidation();
    },
  },
};

</script>
