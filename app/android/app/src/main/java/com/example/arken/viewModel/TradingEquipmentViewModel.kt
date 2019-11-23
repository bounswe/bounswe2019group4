package com.example.arken.viewModel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.MutableLiveData
import com.anychart.AnyChart
import com.anychart.chart.common.dataentry.HighLowDataEntry
import com.anychart.charts.Stock
import com.anychart.core.stock.Plot
import com.anychart.data.Table
import com.anychart.data.TableMapping
import com.example.arken.model.tradingEquipment.Currency
import com.example.arken.util.RetroClient
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response


class TradingEquipmentViewModel(application: Application) : AndroidViewModel(application) {

    val data: MutableLiveData<Currency> = MutableLiveData()
    val weekTable: Table = Table.instantiate("x")
    val monthTable: Table = Table.instantiate("x")
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
                            setChartData()
                        }
                    }
                }

                override fun onFailure(call: Call<Currency>, t: Throwable) {
                    System.out.println(t.message)
                }
            }
        )
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
                            data.value = data.value
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
                            data.value = data.value
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
        val plot: Plot = stock.plot(0)
        plot.area(mapping)
        return stock
    }

    private fun setChartData() {
        var i = 0
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
            if (i < 32) {
                monthTable.addData(
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
                if (i < 8) {
                    weekTable.addData(
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
                i++
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