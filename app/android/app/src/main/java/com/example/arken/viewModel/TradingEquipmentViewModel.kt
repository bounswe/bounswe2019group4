package com.example.arken.viewModel

import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import com.example.arken.model.tradingEquipment.Currency
import com.example.arken.util.RetroClient
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response


class TradingEquipmentViewModel : ViewModel() {
    val data: MutableLiveData<Currency> = MutableLiveData()
    private val apiService by lazy { RetroClient.getInstance().apiService }
    fun setData(code: String) {
        apiService.getCurrency(code).enqueue(
            object : Callback<Currency> {
                override fun onResponse(call: Call<Currency>, response: Response<Currency>) {
                    if (response.isSuccessful) {
                        val currency: Currency? = response.body()
                        if (currency != null) {
                            data.value = currency
                        }
                    }
                }

                override fun onFailure(call: Call<Currency>, t: Throwable) {

                }
            }
        )
    }
}