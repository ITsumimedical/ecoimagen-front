<template>
	<div>
		<v-row dense class="mt-2">
			<v-col cols="12" sm="11" md="11">
				<v-text-field label="Buscar..." dense hint="Ingrese el número de la orden" append-icon="mdi-close"
					@click:append="limpiarFiltro()" outlined v-model="filtro.numeroOrdenMedicamento"
					@keyup.enter="buscarOrdenesMedicamentos()"></v-text-field>
			</v-col>
			<v-col cols="12" sm="1" md="1">
				<v-btn color="primary" dark style="width: 100%" @click="buscarOrdenesMedicamentos()"
					:loading="loading.tablaMedicamentos">
					Buscar
				</v-btn>
			</v-col>
			<v-col cols="12" sm="12" md="12">
				<v-divider></v-divider>
			</v-col>
			<v-col cols="12" sm="12" md="12">
				<v-data-table dense :headers="headersOrdenesMedicamentos" :items="ordenesMedicamentos"
					loading-text="Cargando... Por favor espere" :loading="loading.tablaMedicamentos"
					no-data-text="Señor(a) afiliado(a), usted no posee ordenes de medicamentos" hide-default-footer
					disable-pagination>
					<template v-slot:[`item.estadoOrdenArticulo`]="{ item }">
						<v-chip small dark color="success">
							{{
				  parseInt(item.estado_id) === 1 || parseInt(item.estado_id) === 4
					? "Activa"
					: "Inactiva"
				}}
						</v-chip>
					</template>
					<template v-slot:[`item.dosificacion`]="{ item }">
						<td>
							Tomar {{ item.dosis }} {{ item.unidad_presentacion }} Cada
							{{ item.frecuencia }} {{ item.unidad_tiempo }}
						</td>
					</template>
					<template v-slot:[`item.acciones`]="{ item }">
						<v-tooltip bottom>
							<template v-slot:activator="{ on }">
								<v-btn icon color="info" v-on="on" @click="imprimirOrden(item)">
									<v-icon>mdi-file-download-outline</v-icon>
								</v-btn>
							</template>
							<span>Descargar</span>
						</v-tooltip>
					</template>
				</v-data-table>
			</v-col>
			<v-col cols="12" sm="12" md="12">
				<v-divider></v-divider>
			</v-col>
			<v-col cols="12" sm="11" md="11">
				<v-pagination v-model="paginacion.pagina" :length="Math.ceil(paginacion.total / paginacion.cantidad)"
					@input="buscarOrdenesMedicamentos" :total-visible="9"></v-pagination>
			</v-col>
			<v-col cols="12" sm="1" md="1">
				<v-select :items="[10, 20, 50]" label="Items por página" dense outlined v-model="paginacion.cantidad"
					@change="buscarOrdenesMedicamentos"></v-select>
			</v-col>
		</v-row>
	</div>
</template>
<script>
	import {
		mapActions
	} from "vuex";

	export default {
		data() {
			return {
				loading: {
					tablaMedicamentos: false,
				},
				filtro: {
					numeroOrdenMedicamento: null,
				},
				headersOrdenesMedicamentos: [{
						text: "N° Orden",
						value: "orden.id",
						align: "center"
					},
					{
						text: "Fecha de Vigencia",
						value: "fecha_vigencia",
						align: "center"
					},
					{
						text: "Medicamento",
						value: "codesumi.nombre",
						align: "center"
					},
					{
						text: "Dosificación",
						value: "dosificacion",
						align: "center"
					},
					{
						text: "Página",
						value: "orden.paginacion",
						align: "center"
					},
					{
						text: "Estado",
						value: "estadoOrdenArticulo",
						align: "center"
					},
					{
						text: "Acciones",
						value: "acciones",
						sortable: false,
						align: "center",
					},
				],
				ordenesMedicamentos: [],
				paginacion: {
					pagina: 1,
					cantidad: 10,
					total: 0,
				},
			};
		},

		mounted() {
			this.buscarOrdenesMedicamentos();
		},
		methods: {
			...mapActions("app", ["setPreload"]),

			buscarOrdenesMedicamentos() {
				this.loading.tablaMedicamentos = true;
				const params = {
					page: this.paginacion.pagina,
					cant: this.paginacion.cantidad,
					numeroOrden: this.filtro.numeroOrdenMedicamento,
				};
				this.$axios
					.post("/ordenamiento/ordenesMedicamentosAfiliado", params)
					.then((res) => {
						this.ordenesMedicamentos = res.data.data;
						this.paginacion.total = res.data.total;
					})
					.catch(() => {
						this.$toast.error("Error al obtener las ordenes de medicamentos");
					})
					.finally(() => {
						this.loading.tablaMedicamentos = false;
					});
			},

			imprimirOrden(item) {
				let pdf = {
					tipo: "medicamento",
					id: item.orden_id,
					filtro: item.estado_id,
					detalles: {
						id: item.id,
					},
				};
				this.setPreload(true);

				this.$axios
					.post("/pdf", pdf, {
						responseType: "arraybuffer",
					})
					.then((res) => {
						let blob = new Blob([res.data], {
							type: "application/pdf",
						});
						let link = document.createElement("a");
						link.href = window.URL.createObjectURL(blob);
						window.open(link.href, "_blank");
					})
					.catch((res) => {
						this.$toast.error("Error al generar el pdf");
					})
					.finally(() => {
						this.setPreload(false);
					});
			},

			limpiarFiltro() {
				this.filtro = {
					numeroOrdenMedicamento: null,
				};
				this.buscarOrdenesMedicamentos();
			},
		},
	};

</script>
