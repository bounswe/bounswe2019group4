package com.example.arken.fragment.article

import android.content.Context
import android.content.SharedPreferences
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.navArgs
import com.example.arken.R
import com.example.arken.model.Article
import com.example.arken.util.RetroClient
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class ArticleDetail : Fragment() {
    private lateinit var editButton: Button
    private lateinit var deleteButton: Button
    private lateinit var title: TextView
    private lateinit var text: TextView
    private val args: ArticleDetailArgs by navArgs()
    private lateinit var prefs: SharedPreferences
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val rootView =
            inflater.inflate(R.layout.fragment_article_details, container, false)
        title = rootView.findViewById(R.id.article_detail_title)
        text = rootView.findViewById(R.id.article_detail_text)


        return rootView
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        prefs = getActivity()!!.getSharedPreferences("MyPrefsFile", Context.MODE_PRIVATE)
        val call: Call<Article> =
            RetroClient.getInstance().apiService.getArticle(
                prefs.getString("user_cookie", null),
                args.articleId
            )

        call.enqueue(object : Callback<Article> {
            override fun onResponse(call: Call<Article>, response: Response<Article>) {
                if (response.isSuccessful) {
                    val article: Article? = response.body()
                    title.text = article?.title
                    text.text = article?.text

                } else {
                    Toast.makeText(context, response.raw().toString(), Toast.LENGTH_SHORT)
                        .show()
                }
            }

            override fun onFailure(call: Call<Article>, t: Throwable) {
                Toast.makeText(context, t.message, Toast.LENGTH_SHORT).show()
            }
        })
    }
}