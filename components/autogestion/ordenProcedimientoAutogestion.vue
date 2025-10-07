<template>
	<div>
		<v-row dense class="mt-2">
			<v-col cols="12" sm="11" md="11">
				<v-text-field label="Buscar..." dense hint="Ingrese el número de la orden" append-icon="mdi-close"
					@click:append="limpiarFiltro()" outlined v-model="filtro.numeroOrdenProcedimiento"
					@keyup.enter="buscarOrdenesProcedimientos()"></v-text-field>
			</v-col>
			<v-col cols="12" sm="1" md="1">
				<v-btn color="primary" dark style="width: 100%" @click="buscarOrdenesProcedimientos()"
					:loading="loading.tablaProcedimientos">
					Buscar
				</v-btn>
			</v-col>
			<v-col cols="12" sm="12" md="12">
				<v-divider></v-divider>
			</v-col>
			<v-col cols="12" sm="12" md="12">
				<v-data-table dense :headers="headersOrdenesProcedimientos" :items="ordenesProcedimientos"
					loading-text="Cargando... Por favor espere" :loading="loading.tablaProcedimientos"
					no-data-text="Señor(a) afiliado(a), usted no posee ordenes de procedimientos" hide-default-footer
					disable-pagination>
					<template v-slot:[`item.estadoOrdenProcedimiento`]="{ item }">
						<v-chip small dark color="success">
							{{
				  parseInt(item.estado_id) === 1 || parseInt(item.estado_id) === 4
					? "Activa"
					: "Inactiva"
				}}
						</v-chip>
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
					@input="buscarOrdenesProcedimientos" :total-visible="9"></v-pagination>
			</v-col>
			<v-col cols="12" sm="1" md="1">
				<v-select :items="[10, 20, 50]" label="Items por página" dense outlined v-model="paginacion.cantidad"
					@change="buscarOrdenesProcedimientos"></v-select>
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
					tablaProcedimientos: false,
				},
				filtro: {
					numeroOrdenProcedimiento: null,
				},
				headersOrdenesProcedimientos: [{
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
						text: "Procedimiento",
						value: "cup.nombre",
						align: "center"
					},
					{
						text: "Estado",
						value: "estadoOrdenProcedimiento",
						align: "center"
					},
					{
						text: "Acciones",
						value: "acciones",
						sortable: false,
						align: "center",
					},
				],
				ordenesProcedimientos: [],
				paginacion: {
					pagina: 1,
					cantidad: 10,
					total: 0,
				},
			};
		},

		mounted() {
			this.buscarOrdenesProcedimientos();
		},
		methods: {
			...mapActions("app", ["setPreload"]),

			buscarOrdenesProcedimientos() {
				this.loading.tablaProcedimientos = true;
				const params = {
					page: this.paginacion.pagina,
					cant: this.paginacion.cantidad,
					numeroOrden: this.filtro.numeroOrdenProcedimiento,
				};
				this.$axios
					.post("/ordenamiento/ordenesProcedimientosAfiliado", params)
					.then((res) => {
						this.ordenesProcedimientos = res.data.data;
						this.paginacion.total = res.data.total;
					})
					.catch(() => {
						this.$toast.error("Error al obtener las ordenes de procedimientos");
					})
					.finally(() => {
						this.loading.tablaProcedimientos = false;
					});
			},

			imprimirOrden(item) {
				let pdf = {
					tipo: "servicio",
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
					numeroOrdenProcedimiento: null,
				};
				this.buscarOrdenesProcedimientos();
			},
		},
	};

</script>
