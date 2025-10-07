<template>

	<v-card elevation="0">
		<v-card-title>
			<v-toolbar flat>
				<v-toolbar-title>
					<div class="d-flex align-center">
						<img src="/images/ojo.svg" alt="" height="50px" width="50px" />
						<span>Medicamentos Dispensados</span>
					</div>
				</v-toolbar-title>
				<v-divider class="mx-4" inset vertical></v-divider>
			</v-toolbar>
		</v-card-title>
		<v-card-text>
			<v-form ref="formBuscarAfiliado">
				<v-row>
					<v-col cols="12" md="5" sm="12">
						<v-autocomplete dense outlined label="Tipo de Documento" :items="tiposDocumentos"
							:loading="loading.tiposDocumentos" no-data-text="No hay resultados" item-value="id"
							item-text="nombre" v-model="datosBuscarAfiliado.tipo_documento"
							hint="Ingresa el tipo de documento del afiliado"
							:rules="[(v) => !!v || 'Este campo es requerido']" />
					</v-col>
					<v-col cols="12" md="5" sm="12">
						<v-text-field dense outlined label="Número Documento" @keyup.enter="consultarAfiliado()"
							v-model.trim="datosBuscarAfiliado.numero_documento"
							hint="Ingresa el número de documento del afiliado"
							:rules="[(v) => !!v || 'Este campo es requerido']" />
					</v-col>
					<v-col cols="12" md="2" sm="12" style="display: flex; gap: 0.2rem">
						<v-btn color="primary" dark @click="consultarAfiliado()"
							style="min-width: fit-content">Consultar <v-icon right>mdi-magnify</v-icon></v-btn>
						<v-btn color="red" dark @click="limpiarAfiliado()" style="min-width: fit-content">Limpiar<v-icon
								right>mdi-close</v-icon></v-btn>
					</v-col>
				</v-row>
			</v-form>
			<v-row v-if="afiliado">

				<v-col cols="12" md="12" sm="12">
					<datosAfiliadoDispensacion :afiliado="afiliado"></datosAfiliadoDispensacion>
				</v-col>

				<v-col cols="12" md="12" sm="12">
					<v-divider></v-divider>
					<dispensadosDispensacion ref="dispensadosDispensacion" :afiliadoId="afiliado.id" :tipoDispensacion="tipoDispensacion"/>
				</v-col>

			</v-row>
		</v-card-text>
	</v-card>
</template>
<script>
import { mapActions } from "vuex";
import datosAfiliadoDispensacion from "@/components/farmacia/dispensacion/datosAfiliadoDispensacion.vue";
import dispensadosDispensacion from "@/components/farmacia/dispensacion/dispensadosDispensacion.vue";


export default {
	components: {
		datosAfiliadoDispensacion,
		dispensadosDispensacion,
	},
	data() {
		return {
			loading: {
				tiposDocumentos: false,
				farmacias: false,
			},
			datosBuscarAfiliado: {
				numero_documento: null,
				tipo_documento: null,
			},
			tiposDocumentos: [],
			afiliado: null,
			tipoDispensacion: 1,
			tab: "medicamentosActivos",
		};
	},
	mounted() {
		this.listarTiposDocumentos();
		this.listarFarmacias();
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

		consultarAfiliado() {
			if (!this.$refs.formBuscarAfiliado.validate()) {
				this.$toast.error(
					"Por favor ingrese el tipo de documento y el número de documento."
				);
				return;
			}

			this.afiliado = null;
			this.setPreload(true);
			this.$axios
				.get(
					`/afiliados/${this.datosBuscarAfiliado.numero_documento}/${this.datosBuscarAfiliado.tipo_documento}`
				)
				.then((res) => {
					this.afiliado = res.data;
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

		listarFarmacias() {
			this.loading.farmacias = true;
			this.$axios
				.get("/bodegas/listarBodegasAsociadas")
				.then((res) => {
					this.opcionesFarmacias = res.data;
				})
				.catch((e) => {
					this.$toast.error("Ocurrió un error al cargar las farmacias");
				})
				.finally(() => {
					this.loading.farmacias = false;
				});
		},

	},
};
</script>
