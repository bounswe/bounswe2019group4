package com.example.arken.viewModel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.MutableLiveData
import com.anychart.AnyChart
import com.anychart.chart.common.dataentry.HighLowDataEntry
import com.anychart.charts.Stock
import com.anychart.core.stock.series.Area
import com.anychart.data.Table
import com.anychart.data.TableMapping
import com.example.arken.model.tradingEquipment.Currency
import com.example.arken.model.tradingEquipment.Prediction
import com.example.arken.util.RetroClient
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response


class TradingEquipmentViewModel(application: Application) : AndroidViewModel(application) {

    val data: MutableLiveData<Currency> = MutableLiveData()
    val yearTable: Table = Table.instantiate("x")
    fun setData(code: String, cookie: String?) {
        val call: Call<Currency> = RetroClient.getInstance().apiService.getCurrency(cookie, code)
        call.enqueue(
            object : Callback<Currency> {
                override fun onResponse(call: Call<Currency>, response: Response<Currency>) {

                    if (response.isSuccessful) {
                        val currency: Currency? = response.body()
                        if (currency != null) {
                            data.value = currency
                            setChartData(true)
                        }
                    }
                }

                override fun onFailure(call: Call<Currency>, t: Throwable) {
                    System.out.println(t.message)
                }
            }
        )
    }

    fun prediction(cookie: String, code: String, isUp: Boolean) {
        if (isUp) {
            val call: Call<Currency> =
                RetroClient.getInstance().apiService.predictionCurrency(
                    cookie,
                    Prediction(data.value?.current?.rate?.toDouble(), "up", code)
                )
            call.enqueue(
                object : Callback<Currency> {
                    override fun onResponse(call: Call<Currency>, response: Response<Currency>) {
                        if (response.isSuccessful) {

                        } else {
                            System.out.println(response.code())
                        }
                    }

                    override fun onFailure(call: Call<Currency>, t: Throwable) {
                        System.out.println(t.message)
                    }
                }
            )
        } else {
            val call: Call<Currency> =
                RetroClient.getInstance().apiService.predictionCurrency(
                    cookie,
                    Prediction(data.value?.current?.rate?.toDouble(), "down", code)
                )
            call.enqueue(
                object : Callback<Currency> {
                    override fun onResponse(call: Call<Currency>, response: Response<Currency>) {
                        if (response.isSuccessful) {

                        } else {
                            System.out.println(response.code())
                        }
                    }

                    override fun onFailure(call: Call<Currency>, t: Throwable) {
                        System.out.println(t.message)
                    }
                }
            )
        }
    }
    fun followUnfollow(cookie: String, code: String, alreadyFollow: Boolean) {

        if (alreadyFollow) {
            val call: Call<Currency> =
                RetroClient.getInstance().apiService.unFollowCurrency(cookie, code)
            call.enqueue(
                object : Callback<Currency> {
                    override fun onResponse(call: Call<Currency>, response: Response<Currency>) {
                        if (response.isSuccessful) {
                            data.value?.following = false
                        } else {
                            System.out.println(response.code())
                        }
                    }

                    override fun onFailure(call: Call<Currency>, t: Throwable) {
                        System.out.println(t.message)
                    }
                }
            )
        } else {
            val call: Call<Currency> =
                RetroClient.getInstance().apiService.followCurrency(cookie, code)
            call.enqueue(
                object : Callback<Currency> {
                    override fun onResponse(call: Call<Currency>, response: Response<Currency>) {
                        if (response.isSuccessful) {
                            data.value?.following = true

                        } else {
                            System.out.println(response.code())
                        }
                    }

                    override fun onFailure(call: Call<Currency>, t: Throwable) {
                        System.out.println(t.message)
                    }
                }
            )
        }
    }

    fun setChart(k: Int): Stock {
        var mapping: TableMapping = yearTable.mapAs("{ x: 'x', value: 'low'}")
        val stock: Stock = AnyChart.stock()
        val plot: Area = stock.plot(0).area(mapping)
        plot.name("${data.value?.current?.from}/${data.value?.current?.to}")
        return stock
    }

    private fun setChartData(index: Boolean) {
        if (index) {
        data.value!!.values!!.forEach {
            yearTable.addData(
                listOf(
                    StockDataEntry(
                        it.Date!!,
                        it.open!!.toDouble(),
                        it.high!!.toDouble(),
                        it.low!!.toDouble(),
                        it.close!!.toDouble()
                    )
                )
            )

        }
        } else {
            data.value!!.values!!.forEach {
                yearTable.addData(
                    listOf(
                        StockDataEntry(
                            it.Date!!,
                            1.div(it.open!!.toDouble()),
                            1.div(it.high!!.toDouble()),
                            1.div(it.low!!.toDouble()),
                            1.div(it.close!!.toDouble())
                        )
                    )
                )

            }
        }


    }
}

class StockDataEntry(
    var x: String,
    var open: Double,
    var high: Double,
    var low: Double,
    var close: Double
) : HighLowDataEntry(x, high, low) {

    init {
        setValue("open", open)
        setValue("close", close)
    }
}