package com.example.arken.fragment;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.text.method.HideReturnsTransformationMethod;
import android.text.method.PasswordTransformationMethod;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.InputMethodManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.fragment.app.Fragment;
import androidx.navigation.Navigation;

import com.example.arken.R;
import com.example.arken.model.LoginUser;
import com.example.arken.model.Profile;
import com.example.arken.model.User;
import com.example.arken.util.RetroClient;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

import static android.content.Context.MODE_PRIVATE;

public class LoginFragment extends Fragment implements View.OnClickListener {
    private Button signupButton;
    private EditText emailEditText;
    private EditText passwordEditText;
    private Button loginButton;
    private Button guestButton;
    private ImageView passwordEyeImage;
    public static final String MY_PREFS_NAME = "MyPrefsFile";
    private TextView forgotPasswordButton;
    private String userId;

    @SuppressLint("ClickableViewAccessibility")
    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_login, container, false);
        guestButton = view.findViewById(R.id.signup_guest_button);
        guestButton.setOnClickListener(this);
        signupButton = view.findViewById(R.id.login_signupButton_layout);
        signupButton.setOnClickListener(this);
        loginButton = view.findViewById(R.id.login_login_button);
        loginButton.setOnClickListener(this);
        forgotPasswordButton = view.findViewById(R.id.forgotPasswordButton);
        forgotPasswordButton.setOnClickListener(this);
        emailEditText = view.findViewById(R.id.login_email_editText);
        passwordEditText = view.findViewById(R.id.login_password_editText);
        ConstraintLayout layout = view.findViewById(R.id.login_background);
        layout.setOnClickListener(this);
        passwordEyeImage = view.findViewById(R.id.login_password_eye_image);
        passwordEyeImage.setOnTouchListener(new View.OnTouchListener() {
            @Override
            public boolean onTouch(View view, MotionEvent motionEvent) {
                switch(motionEvent.getAction()){
                    case MotionEvent.ACTION_DOWN:
                        passwordEditText.setTransformationMethod(HideReturnsTransformationMethod.getInstance());
                        return true;
                    case MotionEvent.ACTION_UP:
                        passwordEditText.setTransformationMethod(PasswordTransformationMethod.getInstance());

                        return true;
                    default:
                        return false;

                }
            }
        });
        return view;
    }


    @Override
    public void onClick(View view) {
        if(view.getId()!=R.id.login_email_editText && view.getId()!=R.id.login_password_editText){
            InputMethodManager inputMethodManager = (InputMethodManager)getActivity().getSystemService(Context.INPUT_METHOD_SERVICE);
            inputMethodManager.hideSoftInputFromWindow(view.getWindowToken(), 0);

        }
        if(view.getId() == R.id.login_signupButton_layout){
            Navigation.findNavController(view).navigate(R.id.action_loginFragment_to_signupFragment);

        } else if (view.getId() == R.id.signup_guest_button) {
            Navigation.findNavController(view).navigate(R.id.action_loginFragment_to_baseFragment);
        }
        else if (view.getId() == R.id.forgotPasswordButton){
            Navigation.findNavController(view).navigate(R.id.action_loginFragment_to_forgotPasswordFragment);
        }
        else if(view.getId() == R.id.login_login_button){
            if(emailEditText.getText().toString().trim().equals("")){
                emailEditText.setError("Please enter your email");
                return;
            }
            if(passwordEditText.getText().toString().trim().equals("")){
                passwordEditText.setError("Please enter your password");
                return;
            }

            final String email = String.valueOf(emailEditText.getText());
            String password = String.valueOf(passwordEditText.getText());

            Call<User> call = RetroClient.getInstance().getAPIService().login(new LoginUser(email, password));

            call.enqueue(new Callback<User>() {
                @Override
                public void onResponse(Call<User> call, Response<User> response) {
                    if (response.isSuccessful()) {
                        userId = response.body().get_id();
                        SharedPreferences.Editor editor = getActivity().getSharedPreferences(MY_PREFS_NAME, MODE_PRIVATE).edit();
                        editor.putString("email", email);
                        editor.putString("userId", userId);
                        editor.apply();

                        String cookie = response.headers().get("Set-Cookie");
                        editor.putString("user_cookie", cookie.split(";")[0]);
                        editor.commit();
                     // Toast.makeText(getContext(), response.body().get_id(), Toast.LENGTH_SHORT).show();
                        Navigation.findNavController(signupButton).navigate(R.id.action_loginFragment_to_baseFragment);


                    } else {

                        String errorMessage = null;
                        try {
                            String responseMessage = response.errorBody().string();


                            JSONObject jsonObject = new JSONObject(responseMessage);

                            errorMessage = jsonObject.getString("errmsg");

                        } catch (IOException | JSONException e) {
                            e.printStackTrace();
                        }
                        if(errorMessage!=null) {
                            Toast.makeText(getContext(), errorMessage, Toast.LENGTH_SHORT).show();
                        }

                        else{
                            Toast.makeText(getContext(), "Invalid input. Please try again.", Toast.LENGTH_SHORT).show();
                        }
                    }
                }

                @Override
                public void onFailure(Call<User> call, Throwable t) {
                    Toast.makeText(getContext(),t.getMessage(), Toast.LENGTH_SHORT ).show();
                }
            });
        }
    }
}
