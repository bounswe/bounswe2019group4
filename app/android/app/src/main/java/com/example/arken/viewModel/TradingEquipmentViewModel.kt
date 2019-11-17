package com.example.arken.viewModel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.MutableLiveData
import com.example.arken.model.tradingEquipment.Currency
import com.example.arken.util.RetroClient
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response


class TradingEquipmentViewModel(application: Application) : AndroidViewModel(application) {

    val data: MutableLiveData<Currency> = MutableLiveData()

    fun setData(code: String, cookie: String?) {
        val call: Call<Currency> = RetroClient.getInstance().apiService.getCurrency(cookie, code)
        call.enqueue(
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
}