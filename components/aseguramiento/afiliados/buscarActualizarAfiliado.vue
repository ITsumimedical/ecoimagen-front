<template>
  <div>
    <v-form ref="formBuscarAfiliado">
      <v-row class="mt-4">
        <v-col cols="12" md="4" sm="12">
          <v-autocomplete dense outlined label="Tipo de documento" :items="tiposDocumentos"
            :loading="loading.tiposDocumentos" no-data-text="No hay resultados" item-value="id" item-text="nombre"
            v-model="datosBuscarAfiliado.tipo_documento" hint="Ingresa el tipo de documento del afiliado"
            :rules="[rules.obligatorio]" />
        </v-col>
        <v-col cols="12" md="4" sm="12">
          <v-text-field dense outlined label="Número documento" @keyup.enter="
            consultarAfiliado(
              datosBuscarAfiliado.numero_documento,
              datosBuscarAfiliado.tipo_documento
            )
            " v-model.trim="datosBuscarAfiliado.numero_documento" hint="Ingresa el número de documento del afiliado"
            :rules="[rules.obligatorio]" />
        </v-col>
        <v-col cols="12" md="4" sm="12" style="display: flex; gap: 0.2rem">
          <v-btn color="primary" dark style="width: 49%" @click="
            consultarAfiliado(
              datosBuscarAfiliado.numero_documento,
              datosBuscarAfiliado.tipo_documento
            )
            ">Consultar <v-icon right>mdi-magnify</v-icon>
          </v-btn>
          <v-btn color="red" dark style="width: 49%" @click="limpiarAfiliado()">Limpiar<v-icon right>mdi-close</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
    <!-- Datos de caracterización -->
    <v-form ref="formActualizarDatosAfiliado" v-if="afiliado">
      <v-row dense>
        <v-col cols="12" md="12" sm="12">
          <v-alert color="blue-grey" border="left" type="info" dense text icon="mdi-account-eye" class="text-center">
            <b>Datos de Caracterización Básica</b>
          </v-alert>
        </v-col>
        <v-col cols="12" md="3" sm="6">
          <v-autocomplete :items="tiposDocumentos" label="Tipo de Documento *" item-text="nombre" item-value="id"
            v-model="afiliado.tipo_documento" dense outlined @change="validarEdadAfiliado" :rules="[rules.obligatorio]">
          </v-autocomplete>
        </v-col>
        <v-col cols="12" md="3" sm="6">
          <v-text-field label="Numero de Documento *" v-model="afiliado.numero_documento" :rules="[rules.obligatorio]"
            dense outlined></v-text-field>
        </v-col>
        <v-col cols="12" md="3" sm="6">
          <v-text-field label="Primer Nombre *" v-model="afiliado.primer_nombre" dense outlined
            :rules="[rules.obligatorio]"></v-text-field>
        </v-col>
        <v-col cols="12" md="3" sm="6">
          <v-text-field label="Segundo Nombre" v-model="afiliado.segundo_nombre" dense outlined></v-text-field>
        </v-col>
        <v-col cols="12" md="3" sm="6">
          <v-text-field label="Primer Apellido *" v-model="afiliado.primer_apellido" dense outlined
            :rules="[rules.obligatorio]"></v-text-field>
        </v-col>
        <v-col cols="12" md="3" sm="6">
          <v-text-field label="Segundo Apellido" v-model="afiliado.segundo_apellido" dense outlined></v-text-field>
        </v-col>
        <v-col cols="12" md="3" sm="6">
          <v-autocomplete :items="opcionesEntidad" label="Entidad *" item-text="nombre" item-value="id"
            v-model="afiliado.entidad_id" dense outlined :rules="[rules.obligatorio]"></v-autocomplete>
        </v-col>
        <v-col cols="12" md="3" sm="6">
          <v-autocomplete :items="opcionesSexo" label="Sexo *" item-text="nombre" item-value="id"
            v-model="afiliado.sexo" dense outlined :rules="[rules.obligatorio]"></v-autocomplete>
        </v-col>
        <v-col cols="12" md="3" sm="6">
          <v-menu dense v-model="menuFechaNacimiento" :close-on-content-click="false" :nudge-right="40"
            transition="scale-transition" offset-y min-width="auto">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field v-model="afiliado.fecha_nacimiento" label="Fecha de Nacimiento *" append-icon="mdi-calendar"
                readonly dense outlined v-bind="attrs" v-on="on" @change="actualizarEdad" :rules="[rules.obligatorio]">
              </v-text-field>
            </template>
            <v-date-picker v-model="afiliado.fecha_nacimiento" @input="
              menuFechaNacimiento = false;
            actualizarEdad();
            "></v-date-picker>
          </v-menu>
        </v-col>
        <v-col cols="12" md="3" sm="6">
          <v-text-field label="Edad Cumplida" v-model="edadAfiliado" readonly dense outlined></v-text-field>
        </v-col>
        <v-col cols="12" md="3" sm="6">
          <v-text-field label="Ciclo de Vida" v-model="afiliado.ciclo_vida_atencion" readonly dense outlined>
          </v-text-field>
        </v-col>
        <v-col cols="12" md="3" sm="6">
          <v-menu dense v-model="menuFechaAfiliacion" :close-on-content-click="false" :nudge-right="40"
            transition="scale-transition" offset-y min-width="auto">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field v-model="afiliado.fecha_afiliacion" label="Fecha de Afiliación *" append-icon="mdi-calendar"
                readonly dense outlined v-bind="attrs" v-on="on" :rules="[rules.obligatorio]"></v-text-field>
            </template>
            <v-date-picker v-model="afiliado.fecha_afiliacion" @input="menuFechaAfiliacion = false"></v-date-picker>
          </v-menu>
        </v-col>
        <v-col cols="12" md="3" sm="6">
          <v-autocomplete :loading="loading.tipoAfiliacion" :items="opcionesTipoAfiliacion" label="Tipo de Afiliación *"
            item-text="nombre" item-value="id" v-model="afiliado.tipo_afiliacion_id" dense outlined
            :rules="[rules.obligatorio]"></v-autocomplete>
        </v-col>
        <v-col cols="12" md="3" sm="6">
          <v-autocomplete :loading="loading.tipoAfiliado" :items="opcionesTipoAfiliado" label="Tipo de Afiliado *"
            item-text="nombre" item-value="id" v-model="afiliado.tipo_afiliado_id" dense outlined
            :rules="[rules.obligatorio]"></v-autocomplete>
        </v-col>
        <v-col cols="12" md="3" sm="6">
          <v-autocomplete :items="opcionesEstadoAfiliacion" label="Estado de Afiliación *" item-text="nombre"
            item-value="id" v-model="afiliado.estado_afiliacion_id" dense outlined :rules="[rules.obligatorio]">
          </v-autocomplete>
        </v-col>
        <v-col cols="12" md="3" sm="6">
          <v-autocomplete :items="opcionesGrupoSanguineo" label="Grupo Sanguíneo" v-model="afiliado.grupo_sanguineo"
            dense outlined></v-autocomplete>
        </v-col>
        <v-col cols="12" md="3" sm="6">
          <v-autocomplete :items="opcionesNivelAcademico" label="Nivel Académico" v-model="afiliado.nivel_educativo"
            dense outlined></v-autocomplete>
        </v-col>
        <v-col cols="12" md="3" sm="6">
            <v-autocomplete :items="opcionesOficio" label="Ocupación *" v-model="afiliado.ocupacion" item-text="nombre_oficio" item-value="nombre_oficio" required dense outlined></v-autocomplete>
        </v-col>
        <v-col cols="12" md="3" sm="6">
          <v-autocomplete label="Estado Civil *" v-model="afiliado.estado_civil" :items="opcionesEstadoCivil" dense
            outlined></v-autocomplete>
        </v-col>
        <v-col cols="12" md="3" sm="6">
          <v-autocomplete label="Orientación Sexual" v-model="afiliado.orientacion_sexual"
            :items="opcionesOrientacionSexual" dense outlined></v-autocomplete>
        </v-col>
        <v-col cols="12" md="3" sm="6">
          <v-autocomplete label="Identidad de Género" v-model="afiliado.identidad_genero"
            :items="opcionesIdentidadGenero" dense outlined></v-autocomplete>
        </v-col>
        <v-col cols="12" md="3" sm="6">
          <v-autocomplete label="Discapacidad *" v-model="afiliado.discapacidad" :items="opcionesDiscapacidad" dense
            outlined :rules="[rules.obligatorio]"></v-autocomplete>
        </v-col>
        <v-col cols="12" md="3" sm="6" v-if="
          afiliado.discapacidad &&
          afiliado.discapacidad !== 'Sin discapacidad'
        ">
          <v-autocomplete label="Grado Discapacidad *" v-model="afiliado.grado_discapacidad"
            :items="opcionesGradoDiscapacidad" dense outlined :rules="[rules.obligatorio]"></v-autocomplete>
        </v-col>
        <!-- <v-col cols="12" md="3" sm="6">
          <v-autocomplete label="Rango de ingresos en SMLMV *" v-model="afiliado.salario_minimo_afiliado"
            :items="opcionesRangoSalarial" dense outlined></v-autocomplete>
        </v-col> -->

        <v-col cols="12" md="3" sm="6">
          <v-autocomplete label="Plan *" v-model="afiliado.plan" :items="opcionesPlanes" dense outlined>
          </v-autocomplete>
        </v-col>

        <v-col cols="12" md="3" sm="6">
          <v-autocomplete label="Categoria *" v-model="afiliado.categoria" :items="opcionesCategorias" dense outlined
            :disabled="!afiliado.plan"></v-autocomplete>
        </v-col>

        <v-col cols="12" md="3" sm="6">
          <v-autocomplete label="Medico Familia 1" v-model="afiliado.medico_familia1_id" :items="medicosYAuxiliares"
            :item-text="item => `${item.nombre} - ${item.apellido} - ${item.documento}`" item-value="id" dense
            outlined></v-autocomplete>
        </v-col>

        <v-col cols="12" md="3" sm="6">
          <v-autocomplete label="Medico Familia 2" v-model="afiliado.medico_familia2_id" :items="medicosYAuxiliares"
            :item-text="item => `${item.nombre} - ${item.apellido} - ${item.documento}`" item-value="id" dense
            outlined></v-autocomplete>
        </v-col>

        <v-col cols="12" md="12" sm="12">
          <v-alert color="blue-grey" border="left" type="info" dense text icon="mdi-city" class="text-center">
            <b>Ubicación de Atención</b>
          </v-alert>
        </v-col>
        <v-col cols="12" md="3" sm="6">
          <v-autocomplete :loading="loading.paises" :items="opcionesPaises" label="Nacionalidad *" item-text="nombre"
            item-value="id" v-model="afiliado.pais_id" dense outlined :rules="[rules.obligatorio]"></v-autocomplete>
        </v-col>
        <v-col cols="12" md="3" sm="6">
          <v-autocomplete :loading="loading.departamentos" :items="opcionesDepartamentos"
            label="Departamento de Afiliación *" item-text="nombre" item-value="id"
            v-model="afiliado.departamento_afiliacion_id" dense outlined @change="
              filtrarMunicipios(
                afiliado.departamento_afiliacion_id,
                'afiliacion'
              )
              " :rules="[rules.obligatorio]"></v-autocomplete>
        </v-col>
        <v-col cols="12" md="3" sm="6">
          <v-text-field dense outlined label="Código Dane Departamento"
            v-model="afiliado.departamento_afiliacion.codigo_dane" readonly></v-text-field>
        </v-col>
        <v-col cols="12" md="3" sm="6">
          <v-autocomplete :loading="loading.municipios" :items="opcionesMunicipiosAfiliacion"
            label="Municipio de Afiliación *" item-text="nombre" item-value="id"
            v-model="afiliado.municipio_afiliacion_id" dense outlined :rules="[rules.obligatorio]"></v-autocomplete>
        </v-col>
        <v-col cols="12" md="3" sm="6">
          <v-text-field dense outlined label="Código Dane Municipio"
            v-model="afiliado.municipio_afiliacion.codigo_dane"></v-text-field>
        </v-col>
        <v-col cols="12" md="3" sm="6">
          <v-autocomplete :loading="loading.departamentos" :items="opcionesDepartamentos"
            label="Departamento de Atención *" item-text="nombre" item-value="id"
            v-model="afiliado.departamento_atencion_id" dense :rules="[rules.obligatorio]" outlined @change="
              filtrarMunicipios(
                afiliado.departamento_atencion_id,
                'atencion'
              )
              "></v-autocomplete>
        </v-col>
        <v-col cols="12" md="3" sm="6">
          <v-autocomplete :loading="loading.municipios" :items="opcionesMunicipiosAtencion"
            label="Municipio de Atención *" :rules="[rules.obligatorio]" item-text="nombre" item-value="id"
            v-model="afiliado.municipio_atencion_id" dense outlined
            @change="listarReps(afiliado.municipio_atencion_id)"></v-autocomplete>
        </v-col>
        <v-col cols="12" sm="6" md="3" v-if="afiliado.municipio_atencion_id === 149">
          <v-autocomplete dense :items="localidades" v-model="afiliado.localidad" outlined
            label="Localidad"></v-autocomplete>
        </v-col>
        <v-col cols="12" md="3" sm="6">
          <v-autocomplete :items="opcionesRegion" label="Región *" v-model="afiliado.region"
            :rules="[rules.obligatorio]" dense outlined></v-autocomplete>
        </v-col>
        <v-col cols="12" md="12" sm="12">
          <v-autocomplete :items="opcionesIPS" label="IPS Primaria *" v-model="afiliado.ips_id" dense outlined
            item-text="nombre" item-value="id" :rules="[rules.obligatorio]"></v-autocomplete>
        </v-col>
        <v-col cols="12" md="12" sm="12">
          <v-alert color="blue-grey" border="left" type="info" dense text icon="mdi-cellphone-information"
            class="text-center">
            <b>Datos de Contacto y Localización</b>
          </v-alert>
        </v-col>
        <v-col cols="12" md="3" sm="6">
          <v-text-field dense outlined label="Teléfono" v-model="afiliado.telefono"></v-text-field>
        </v-col>
        <v-col cols="12" md="3" sm="6">
          <v-text-field dense outlined label="Celular Principal *" v-model="afiliado.celular1" type="number" :min="0"
            hide-spin-buttons :rules="[rules.obligatorio]"></v-text-field>
        </v-col>
        <v-col cols="12" md="3" sm="6">
          <v-text-field dense outlined label="Celular Secundario" v-model="afiliado.celular2"></v-text-field>
        </v-col>
        <v-col cols="12" md="3" sm="6">
          <v-text-field dense type="email" outlined label="Correo Electrónico Principal *" v-model="afiliado.correo1"
            :rules="[rules.obligatorio, rules.correo]"></v-text-field>
        </v-col>
        <v-col cols="12" md="3" sm="6">
          <v-text-field dense type="email" outlined label="Correo Electrónico Secundario" v-model="afiliado.correo2">
          </v-text-field>
        </v-col>
        <v-col cols="12" md="3" sm="6">
          <v-autocomplete dense :items="opcionesDireccionResidencia" outlined
            label="(Calle, Avenida, Carrera, etc...) *" v-model="afiliado.direccion_residencia_cargue"
            :rules="[rules.obligatorio]"></v-autocomplete>
        </v-col>
        <v-col cols="12" md="3" sm="6">
          <v-text-field dense outlined v-model="afiliado.direccion_residencia_via" label="Numero Exterior *"
            hint="Nota: Número, letras despues de la calle y antes del #"></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-text-field dense outlined v-model="afiliado.direccion_residencia_numero_interior"
            label="Primer Número Interior *" hint="Nota: primer número despues del #">
          </v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-text-field dense v-model="afiliado.direccion_residencia_interior" outlined
            label="Segundo Número Interior *" hint="Nota: Segundo número despues del #">
          </v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-text-field dense v-model="afiliado.direccion_residencia_numero_exterior" outlined label="Interior *"
            hint="Ejemplo: Apte 430, Urb. Peña, Casa 124">
          </v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-text-field dense v-model="afiliado.direccion_residencia_barrio" outlined label="Barrio">
          </v-text-field>
        </v-col>
        <v-col cols="12" md="3" sm="6">
          <v-autocomplete :loading="loading.departamentos" :items="opcionesDepartamentos"
            label="Departamento de Residencia *" item-text="nombre" item-value="id"
            v-model="afiliado.dpto_residencia_id" dense outlined @change="
              filtrarMunicipios(
                afiliado.dpto_residencia_id,
                'residencia'
              );
            listarColegios(afiliado.dpto_residencia_id);
            " :rules="[rules.obligatorio]"></v-autocomplete>
        </v-col>
        <v-col cols="12" md="3" sm="6">
          <v-autocomplete :loading="loading.municipios" :items="opcionesMunicipiosResidencia"
            label="Municipio de Residencia *" item-text="nombre" item-value="id" v-model="afiliado.mpio_residencia_id"
            dense outlined :rules="[rules.obligatorio]"></v-autocomplete>
        </v-col>
        <v-col cols="12" md="9" sm="12" v-if="afiliado.tipo_afiliado_id !== 1">
          <v-autocomplete :loading="loading.colegios" :items="opcionesColegios" label="Colegio" item-text="nombre"
            item-value="id" v-model="afiliado.colegio_id" dense outlined></v-autocomplete>
        </v-col>
        <!-- Datos del beneficiario -->
        <v-col cols="12" sm="6" md="12" v-if="afiliado.tipo_afiliado_id == 1">
          <v-alert border="left" dense text color="blue-grey" icon="mdi-human-male-board">
            <strong>Datos del Cotizante</strong>
          </v-alert>
        </v-col>
        <v-col cols="12" sm="6" md="3" v-if="afiliado.tipo_afiliado_id == 1">
          <v-autocomplete outlined dense v-model="afiliado.parentesco" label="Parentesco" :items="parentesco">
          </v-autocomplete>
        </v-col>
        <v-col cols="12" sm="6" md="3" v-if="afiliado.tipo_afiliado_id == 1">
          <v-autocomplete :rules="[rules.obligatorioBeneficiario]" dense outlined :items="tiposDocumentos"
            v-model="afiliado.tipo_documento_cotizante" item-text="nombre" item-value="nombre"
            label="Tipo de documento cotizante">
          </v-autocomplete>
        </v-col>
        <v-col cols="12" sm="6" md="3" v-if="afiliado.tipo_afiliado_id == 1">
          <v-text-field :rules="[rules.obligatorioBeneficiario]" outlined dense
            v-model="afiliado.numero_documento_cotizante" label="Documento cotizante"
            hint="No usar puntos o caracteres especiales">
          </v-text-field>
        </v-col>
        <v-col cols="12" md="12" sm="12" align="end">
          <v-btn dark color="success" @click="enviarFormularioAfiliado()">Guardar</v-btn>
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>
<script>
import { mapActions } from "vuex";

export default {
  data() {
    return {
      loading: {
        tiposDocumentos: false,
        entidades: false,
        tipoAfiliacion: false,
        tipoAfiliado: false,
        paises: false,
        departamentos: false,
        reps: false,
        colegios: false,
        oficios: false,
      },
      datosBuscarAfiliado: {
        numero_documento: null,
        tipo_documento: null,
      },
      medicosYAuxiliares: [],
      tiposDocumentos: [],
      afiliado: null,
      rules: {
        obligatorio: (value) => !!value || "Este campo es obligatorio.",
        correo: (v) =>
          this.emailRegex.test(v) || "Debe ser un correo válido",
        obligatorioBeneficiario: (value) => {
          if (this.afiliado.tipo_afiliado_id === 1) {
            return (
              !!value ||
              "Este campo es obligatorio para el tipo de afiliado es beneficiario."
            );
          }
          return true;
        },
        min: (v) =>
          v.length === 10 ||
          "Este campo debe tener exactamente 10 caracteres",
      },
      emailRegex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      opcionesEntidad: [],
      opcionesSexo: [
        {
          id: "M",
          nombre: "Masculino",
        },
        {
          id: "F",
          nombre: "Femenino",
        },
      ],
      localidades: [
        "PUENTE ARANDA",
        "CIUDAD BOLIVAR",
        "ANTONIO NARINO",
        "ENGATIVA",
        "KENNEDY",
        "FACATATIVA",
        "BOSA",
        "USAQUEN",
        "SUBA",
        "LOS MARTIRES",
        "TUNJA",
        "TUNJUELITO",
        "CAJICA",
        "FONTIBON",
        "FUSAGASUGA",
        "SD",
        "CHIQUINQUIRA",
        "BARRIOS UNIDOS",
        "IBAGUE",
        "SOGAMOSO",
        "SANTA FE",
        "DUITAMA",
        "GIRARDOT",
        "NEIVA",
        "RAFAEL URIBE",
        "LA DORADA",
        "VILLAVICENCIO",
        "CHOCONTA",
        "AMBALEMA",
        "HONDA",
        "CACHIPAY",
        "PUERTO SALGAR",
        "ZIPAQUIRA",
        "USME",
        "TENA",
        "MONIQUIRA",
        "SAN SEBASTIAN DE MARIQUITA",
        "NATAGAIMA",
        "PAIPA",
        "FLANDES",
        "SAN CRISTOBAL",
        "TOCAIMA",
        "GUAJIRA",
        "CUNDINAMARCA",
        "FUNZA",
        "SOACHA",
      ],
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
      menuFechaNacimiento: false,
      menuFechaAfiliacion: false,
      edadAfiliado: null,
      opcionesTipoAfiliacion: [],
      opcionesTipoAfiliado: [],
      opcionesEstadoAfiliacion: [
        {
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
      opcionesPlanes: ["PAC", "POS"],
      opcionesCategorias: ["A", "B", "C"],
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
      opcionesOficio: [],
      buscarOficio: null,
    };
  },
  mounted() {
    this.listarTiposDocumentos();
    this.listarEntidades();
    this.listarTiposAfiliacion();
    this.listarTiposAfiliado();
    this.listarPaies();
    this.listarDepartamentos();
    this.traerMedicos();
    this.listarOficios();
  },
  watch: {
        "afiliado.ocupacion"(nuevoValor) {
            if (nuevoValor && nuevoValor.length > 0 && this.opcionesOficio.length === 0) {
                this.listarOficios();
            }
        }
    },
  methods: {
    ...mapActions("app", ["setPreload"]),

    listarTiposDocumentos() {
      this.loading.tiposDocumentos = true;
      this.$axios
        .get("/tipo-documento/listar")
        .then((res) => {
          this.tiposDocumentos = res.data;
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

    consultarAfiliado(numero_documento, tipo_documento) {
      if (!this.$refs.formBuscarAfiliado.validate()) {
        this.$toast.error(
          "Por favor ingrese el tipo de documento y el número de documento."
        );
        return;
      }

      this.afiliado = null;
      this.setPreload(true);
      this.$axios
        .post(
          `/afiliados/buscarAfiliados/${numero_documento}/${tipo_documento}`
        )
        .then((res) => {
          this.afiliado = res.data;
          this.afiliado.tipo_documento = res.data.tipo_documento.id;
          this.actualizarEdad();

          // Filtrar los municipios de afiliación si el afiliado tiene departamento de afiliación
          if (this.afiliado.departamento_afiliacion_id) {
            this.filtrarMunicipios(
              this.afiliado.departamento_afiliacion_id,
              "afiliacion"
            );
          }

          // Filtrar los municipios de atención si el afiliado tiene departamento de atención
          if (this.afiliado.departamento_atencion_id) {
            this.filtrarMunicipios(
              this.afiliado.departamento_atencion_id,
              "atencion"
            );
          }

          if (this.afiliado.dpto_residencia_id) {
            this.filtrarMunicipios(
              this.afiliado.dpto_residencia_id,
              "residencia"
            );
            this.listarColegios(this.afiliado.dpto_residencia_id);
          }

          if (this.afiliado.ips_id) {
            this.listarReps(this.afiliado.municipio_atencion_id);
          }
        })
        .catch((error) => {
          this.$toast.error(
            "El afiliado no se encuentra registrado en la base de datos."
          );
          console.log(error);
        })
        .finally(() => {
          this.setPreload(false);
        });
    },

    limpiarAfiliado() {
      this.datosBuscarAfiliado = {
        numero_documento: null,
        tipo_documento: null,
      };
      this.afiliado = null;

      this.$refs.formBuscarAfiliado.resetValidation();
    },

    listarEntidades() {
      this.loading.entidades = true;
      this.$axios
        .get("/entidad/listar")
        .then((res) => {
          this.opcionesEntidad = res.data;
        })
        .catch((error) => {
          this.$toast.error("Error al cargar las entidades");
        })
        .finally(() => {
          this.loading.entidades = false;
        });
    },

    listarTiposAfiliacion() {
      this.loading.tipoAfiliacion = true;
      this.$axios
        .get("tipo-afiliacion")
        .then((res) => {
          this.opcionesTipoAfiliacion = res.data.data;
        })
        .catch((error) => {
          this.$toast.error(
            "Error al cargar los tipos de afiliaciones"
          );
        })
        .finally(() => {
          this.loading.tipoAfiliacion = false;
        });
    },

    listarTiposAfiliado() {
      this.loading.tipoAfiliado = true;
      this.$axios
        .get("tipo-afiliados/listar")
        .then((res) => {
          this.opcionesTipoAfiliado = res.data.data;
        })
        .catch((error) => {
          this.$toast.error("Error al cargar los tipos de afiliados");
        })
        .finally(() => {
          this.loading.tipoAfiliado = false;
        });
    },

    listarPaies() {
      this.loading.paises = true;
      this.$axios
        .post("/pais/listar")
        .then((res) => {
          this.opcionesPaises = res.data.map((pais) => {
            return {
              id: pais.id,
              nombre: `${pais.nombre}`,
            };
          });
        })
        .catch((error) => {
          this.$toast.error(error.response.data.mensaje);
        })
        .finally(() => {
          this.loading.paises = false;
        });
    },

    listarDepartamentos() {
      this.loading.departamentos = true;
      this.$axios
        .get("/departamento")
        .then((res) => {
          this.opcionesDepartamentos = res.data;
        })
        .catch((error) => {
          this.$toast.error("Error al cargar los departamentos");
        })
        .finally(() => {
          this.loading.departamentos = false;
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
            console.error(
              "Tipo de municipio no reconocido:",
              tipoMunicipio
            );
        }
        return;
      }

      switch (tipoMunicipio) {
        case "afiliacion":
          this.opcionesMunicipiosAfiliacion =
            departamentoSeleccionado.municipios;
          break;
        case "atencion":
          this.opcionesMunicipiosAtencion =
            departamentoSeleccionado.municipios;
          break;
        case "residencia":
          this.opcionesMunicipiosResidencia =
            departamentoSeleccionado.municipios;
          break;
        default:
          console.error(
            "Tipo de municipio no reconocido:",
            tipoMunicipio
          );
      }
    },

    listarReps(municipioId) {
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
              icon: "info",
              confirmButtonText: "Aceptar",
            });
          }
        })
        .catch(() => {
          this.$swal({
            title: "Error",
            text: "No se pudo listar los colegios.",
            icon: "error",
            confirmButtonText: "Aceptar",
          });
        })
        .finally(() => {
          this.loading.colegios = false;
        });
    },

    calcularEdad(fechaNacimiento) {
      const fecha_nacimiento = this.$moment();

      const anios = fecha_nacimiento.diff(fechaNacimiento, "years");
      if (anios > 0) {
        return anios + " años";
      }
      return fecha_nacimiento.diff(fechaNacimiento, "months") + " meses";
    },

    validarEdadAfiliado() {
      const edad = this.calcularEdad(this.afiliado.fecha_nacimiento);
      const tipoDocumento = this.afiliado.tipo_documento;
      const edadMinima = this.edadMinimaPorDocumento[tipoDocumento];
      const edadMaxima = this.edadMaximaPorDocumento[tipoDocumento];

      if (edad < edadMinima) {
        this.$toast.error(
          `La edad del afiliado (${edad} años) es menor que la mínima requerida para el tipo de documento seleccionado (${edadMinima} años).`
        );
        return false;
      }
      if (edadMaxima !== null && edad > edadMaxima) {
        this.$toast.error(
          `La edad del afiliado (${edad} años) excede la máxima permitida para el tipo de documento seleccionado (${edadMaxima} años).`
        );
        return false;
      }
      return true;
    },

    actualizarEdad() {
      if (this.afiliado.fecha_nacimiento) {
        this.edadAfiliado = this.calcularEdad(
          this.afiliado.fecha_nacimiento
        );
      } else {
        this.edadAfiliado = null;
      }
      this.validarEdadAfiliado();
      this.getCicloVida();
    },

    traerMedicos() {
      this.$axios
        .get(
          "/especialidades/listar-medicos-y-auxiliares/" + 1
        )
        .then((response) => {
          this.medicosYAuxiliares = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },

    enviarFormularioAfiliado() {
      if (!this.$refs.formActualizarDatosAfiliado.validate()) {
        this.$toast.error(
          "Por favor complete todos los campos obligatorios antes de enviar."
        );
        return;
      }

      if (!this.validarEdadAfiliado()) {
        return; // Si la validación de la edad falla, detener el envío
      }

      this.setPreload(true);
      this.$axios
        .put(
          `/afiliados/actualizarAfiliado/${this.afiliado.id}`,
          this.afiliado
        )
        .then((res) => {
          this.$toast.success(
            "Se actualizó correctamente el afiliado."
          );
          this.consultarAfiliado(
            res.data.numero_documento,
            res.data.tipo_documento
          );
        })
        .catch((error) => {
          console.log(error);
          this.$toast.error("Error al actualizar el afiliado");
        })
        .finally(() => {
          this.setPreload(false);
        });
    },

    listarOficios() {
        this.loading.oficios = true;
        this.$axios
          .post("/oficio/listarOficiosNombre")
          .then((res) => {
            this.opcionesOficio = res.data.map(oficio => ({
              ...oficio,
              nombre_oficio: oficio.nombre_oficio,
            }));
          })
          .catch((error) => {
            this.$toast.error("Error al cargar las ocupaciones");
          })
          .finally(() => {
            this.loading.oficios = false;
        });
    },

    getCicloVida() {

        const fechaNacimiento = this.$moment(this.afiliado.fecha_nacimiento, "YYYY-MM-DD");
        const edad = this.$moment().diff(fechaNacimiento, 'years') || 0;

        if (edad <= 5) {
            this.afiliado.ciclo_vida_atencion = "Primera Infancia (0-5 Años)";
        } else if (edad >= 6 && edad <= 11) {
            this.afiliado.ciclo_vida_atencion = "Infancia (6-11 Años)";
        } else if (edad >= 12 && edad <= 17) {
            this.afiliado.ciclo_vida_atencion = "Adolescencia (12 A 17 Años)";
        } else if (edad >= 18 && edad <= 28) {
            this.afiliado.ciclo_vida_atencion = "Joven (18 A 28 Años)";
        } else if (edad >= 29 && edad <= 59) {
            this.afiliado.ciclo_vida_atencion = "Adulto (29 A 59 Años)";
        } else {
            this.afiliado.ciclo_vida_atencion = "Vejez (Mayor a 60 Años)";
        }
    },
  },
};
</script>
